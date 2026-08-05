import { runQuery } from '../db.js';

// ── Engineers ────────────────────────────────────────────────────────────────

export async function getAllEngineers() {
  const records = await runQuery(`
    MATCH (e:Engineer)
    OPTIONAL MATCH (e)-[hs:HAS_SKILL]->(s:Skill)
    OPTIONAL MATCH (e)-[:WORKED_AT]->(c:Company)
    WITH e, collect(DISTINCT {name: s.name, level: hs.level, years: hs.years}) AS skills,
         collect(DISTINCT c.name) AS companies
    RETURN e.id AS id, e.name AS name, e.title AS title, e.location AS location,
           e.avatar AS avatar, skills, companies
    ORDER BY e.name
  `);
  return records.map(toPlain);
}

export async function getEngineerById(id) {
  const records = await runQuery(`
    MATCH (e:Engineer {id: $id})
    OPTIONAL MATCH (e)-[hs:HAS_SKILL]->(s:Skill)
    OPTIONAL MATCH (e)-[wa:WORKED_AT]->(c:Company)
    OPTIONAL MATCH (e)-[:BUILT]->(p:Project)
    OPTIONAL MATCH (e)-[:KNOWS]->(k:Engineer)
    WITH e,
         collect(DISTINCT {name: s.name, level: hs.level, years: hs.years}) AS skills,
         collect(DISTINCT {company: c.name, role: wa.role, from: wa.from, to: wa.to}) AS experience,
         collect(DISTINCT {id: p.id, name: p.name, description: p.description}) AS projects,
         collect(DISTINCT {id: k.id, name: k.name, title: k.title}) AS connections
    RETURN e.id AS id, e.name AS name, e.title AS title, e.location AS location,
           e.bio AS bio, e.avatar AS avatar, e.github AS github,
           skills, experience, projects, connections
  `, { id });
  return records.map(toPlain)[0] ?? null;
}

export async function searchEngineers(query) {
  // Split into individual terms (drop stop words shorter than 3 chars)
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length >= 3);

  // Always include the full phrase as a term too
  const allTerms = [...new Set([query.toLowerCase(), ...terms])];

  const records = await runQuery(`
    MATCH (e:Engineer)
    OPTIONAL MATCH (e)-[hs:HAS_SKILL]->(s:Skill)
    OPTIONAL MATCH (e)-[:WORKED_AT]->(c:Company)
    WITH e, collect(DISTINCT {name: s.name, level: hs.level, years: hs.years}) AS skills,
         collect(DISTINCT c.name) AS companies
    WHERE any(term IN $terms WHERE
      toLower(e.name) CONTAINS term
      OR toLower(e.title) CONTAINS term
      OR any(skill IN skills WHERE toLower(skill.name) CONTAINS term)
      OR any(co IN companies WHERE toLower(co) CONTAINS term)
    )
    WITH e, skills, companies,
      size([term IN $terms WHERE
        any(skill IN skills WHERE toLower(skill.name) CONTAINS term)
      ]) AS skillMatchCount
    RETURN e.id AS id, e.name AS name, e.title AS title, e.location AS location,
           e.avatar AS avatar, skills, companies
    ORDER BY skillMatchCount DESC, e.name
  `, { terms: allTerms });
  return records.map(toPlain);
}

// Multi-hop: engineers who share ≥2 skills AND have worked at the same company
export async function getRelatedEngineers(engineerId) {
  const records = await runQuery(`
    MATCH (me:Engineer {id: $id})-[:HAS_SKILL]->(s:Skill)<-[:HAS_SKILL]-(other:Engineer)
    WHERE other.id <> $id
    WITH me, other, collect(s.name) AS sharedSkills
    WHERE size(sharedSkills) >= 2
    OPTIONAL MATCH (me)-[:WORKED_AT]->(c:Company)<-[:WORKED_AT]-(other)
    WITH other, sharedSkills, collect(DISTINCT c.name) AS sharedCompanies
    RETURN other.id AS id, other.name AS name, other.title AS title,
           other.avatar AS avatar, sharedSkills, sharedCompanies,
           size(sharedSkills) AS score
    ORDER BY score DESC
    LIMIT 10
  `, { id: engineerId });
  return records.map(toPlain);
}

// Shortest skill bridge between two engineers (graph-native path query)
export async function getSkillBridge(fromId, toId) {
  const records = await runQuery(`
    MATCH path = shortestPath(
      (a:Engineer {id: $fromId})-[:HAS_SKILL|KNOWS*..6]-(b:Engineer {id: $toId})
    )
    RETURN [node IN nodes(path) | {
      label: labels(node)[0],
      name: coalesce(node.name, ''),
      id: coalesce(node.id, '')
    }] AS pathNodes,
    length(path) AS hops
  `, { fromId, toId });
  return records.map(toPlain)[0] ?? null;
}

// ── Skills ────────────────────────────────────────────────────────────────────

export async function getAllSkills() {
  const records = await runQuery(`
    MATCH (s:Skill)
    OPTIONAL MATCH (e:Engineer)-[:HAS_SKILL]->(s)
    OPTIONAL MATCH (p:Project)-[:USES]->(s)
    OPTIONAL MATCH (r:Role)-[:REQUIRES_SKILL]->(s)
    RETURN s.id AS id, s.name AS name, s.category AS category,
           count(DISTINCT e) AS engineerCount,
           count(DISTINCT p) AS projectCount,
           count(DISTINCT r) AS roleCount
    ORDER BY engineerCount DESC
  `);
  return records.map(toPlain);
}

export async function getSkillById(id) {
  const records = await runQuery(`
    MATCH (s:Skill {id: $id})
    OPTIONAL MATCH (e:Engineer)-[hs:HAS_SKILL]->(s)
    OPTIONAL MATCH (p:Project)-[:USES]->(s)
    OPTIONAL MATCH (c:Company)-[:HAS_ROLE]->(:Role)-[:REQUIRES_SKILL]->(s)
    RETURN s.id AS id, s.name AS name, s.category AS category,
           collect(DISTINCT {id: e.id, name: e.name, title: e.title, level: hs.level, years: hs.years}) AS engineers,
           collect(DISTINCT {id: p.id, name: p.name}) AS projects,
           collect(DISTINCT c.name) AS companies
  `, { id });
  return records.map(toPlain)[0] ?? null;
}

// ── Companies ────────────────────────────────────────────────────────────────

export async function getAllCompanies() {
  const records = await runQuery(`
    MATCH (c:Company)
    OPTIONAL MATCH (e:Engineer)-[:WORKED_AT]->(c)
    OPTIONAL MATCH (c)-[:HAS_ROLE]->(r:Role)
    RETURN c.id AS id, c.name AS name, c.industry AS industry,
           c.size AS size, c.location AS location,
           count(DISTINCT e) AS engineerCount,
           count(DISTINCT r) AS openRoles
    ORDER BY engineerCount DESC
  `);
  return records.map(toPlain);
}

// ── Role Matcher ──────────────────────────────────────────────────────────────

export async function getRoles() {
  const records = await runQuery(`
    MATCH (c:Company)-[:HAS_ROLE]->(r:Role)
    OPTIONAL MATCH (r)-[:REQUIRES_SKILL]->(s:Skill)
    WITH c, r, collect({id: s.id, name: s.name}) AS requiredSkills
    RETURN r.id AS id, r.title AS title, r.remote AS remote,
           r.salaryRange AS salaryRange, r.seniority AS seniority,
           c.name AS company, c.id AS companyId, requiredSkills
    ORDER BY c.name, r.title
  `);
  return records.map(toPlain);
}

export async function matchEngineersForRole(roleId) {
  const records = await runQuery(`
    MATCH (r:Role {id: $roleId})-[:REQUIRES_SKILL]->(required:Skill)
    WITH r, collect(required) AS requiredSkills, collect(required.id) AS requiredIds
    MATCH (e:Engineer)-[:HAS_SKILL]->(s:Skill)
    WHERE s.id IN requiredIds
    WITH r, requiredSkills, requiredIds, e, collect(s) AS matched
    WITH r, requiredSkills, e, matched,
         [s IN requiredSkills WHERE NOT s.id IN [ms IN matched | ms.id]] AS missing,
         size(matched) AS matchCount,
         size(requiredSkills) AS totalRequired
    RETURN e.id AS id, e.name AS name, e.title AS title, e.avatar AS avatar,
           e.location AS location,
           [s IN matched | s.name] AS matchedSkills,
           [s IN missing | s.name] AS missingSkills,
           matchCount, totalRequired,
           toFloat(matchCount) / totalRequired AS matchScore
    ORDER BY matchScore DESC, matchCount DESC
    LIMIT 20
  `, { roleId });
  return records.map(toPlain);
}

// ── Explore / Discovery ───────────────────────────────────────────────────────

export async function getMostConnectedSkills() {
  const records = await runQuery(`
    MATCH (s:Skill)
    OPTIONAL MATCH (e:Engineer)-[:HAS_SKILL]->(s)
    OPTIONAL MATCH (p:Project)-[:USES]->(s)
    RETURN s.id AS id, s.name AS name, s.category AS category,
           count(DISTINCT e) + count(DISTINCT p) AS connections
    ORDER BY connections DESC
    LIMIT 12
  `);
  return records.map(toPlain);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function toPlain(record) {
  const obj = {};
  for (const key of record.keys) {
    const val = record.get(key);
    obj[key] = convertNeo4jValue(val);
  }
  return obj;
}

function convertNeo4jValue(val) {
  if (val === null || val === undefined) return val;
  if (typeof val === 'bigint') return Number(val);
  // Neo4j Integer
  if (val && typeof val === 'object' && 'low' in val && 'high' in val) {
    return val.toNumber ? val.toNumber() : val.low;
  }
  if (Array.isArray(val)) return val.map(convertNeo4jValue);
  if (typeof val === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(val)) out[k] = convertNeo4jValue(v);
    return out;
  }
  return val;
}
