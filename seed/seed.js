import 'dotenv/config';
import neo4j from 'neo4j-driver';

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const skills = [
  { id: 's-rails', name: 'Ruby on Rails', category: 'Backend' },
  { id: 's-react', name: 'React', category: 'Frontend' },
  { id: 's-postgres', name: 'PostgreSQL', category: 'Database' },
  { id: 's-k8s', name: 'Kubernetes', category: 'DevOps' },
  { id: 's-python', name: 'Python', category: 'Backend' },
  { id: 's-go', name: 'Go', category: 'Backend' },
  { id: 's-ts', name: 'TypeScript', category: 'Frontend' },
  { id: 's-node', name: 'Node.js', category: 'Backend' },
  { id: 's-aws', name: 'AWS', category: 'DevOps' },
  { id: 's-redis', name: 'Redis', category: 'Database' },
  { id: 's-graphql', name: 'GraphQL', category: 'Backend' },
  { id: 's-docker', name: 'Docker', category: 'DevOps' },
  { id: 's-ml', name: 'Machine Learning', category: 'AI/ML' },
  { id: 's-rust', name: 'Rust', category: 'Systems' },
  { id: 's-elixir', name: 'Elixir', category: 'Backend' },
  { id: 's-vue', name: 'Vue.js', category: 'Frontend' },
  { id: 's-kafka', name: 'Kafka', category: 'Data' },
  { id: 's-spark', name: 'Apache Spark', category: 'Data' },
  { id: 's-terraform', name: 'Terraform', category: 'DevOps' },
  { id: 's-gcp', name: 'GCP', category: 'DevOps' },
];

const companies = [
  { id: 'c-stripe', name: 'Stripe', industry: 'Fintech', size: 'Large', location: 'San Francisco, CA' },
  { id: 'c-plaid', name: 'Plaid', industry: 'Fintech', size: 'Mid', location: 'San Francisco, CA' },
  { id: 'c-shopify', name: 'Shopify', industry: 'E-commerce', size: 'Large', location: 'Ottawa, ON' },
  { id: 'c-linear', name: 'Linear', industry: 'Dev Tools', size: 'Small', location: 'Remote' },
  { id: 'c-vercel', name: 'Vercel', industry: 'Dev Tools', size: 'Mid', location: 'Remote' },
  { id: 'c-ramp', name: 'Ramp', industry: 'Fintech', size: 'Mid', location: 'New York, NY' },
  { id: 'c-figma', name: 'Figma', industry: 'Design Tools', size: 'Large', location: 'San Francisco, CA' },
  { id: 'c-notion', name: 'Notion', industry: 'Productivity', size: 'Mid', location: 'San Francisco, CA' },
  { id: 'c-fly', name: 'Fly.io', industry: 'Infrastructure', size: 'Small', location: 'Remote' },
  { id: 'c-render', name: 'Render', industry: 'Infrastructure', size: 'Small', location: 'San Francisco, CA' },
];

const engineers = [
  { id: 'e-1', name: 'Priya Nair', title: 'Senior Backend Engineer', location: 'San Francisco, CA', bio: 'Distributed systems enthusiast. Previously built payments infra at Stripe.', github: 'priya-nair' },
  { id: 'e-2', name: 'Marcus Webb', title: 'Staff Engineer', location: 'New York, NY', bio: 'Infrastructure and platform engineering. Love Go and Kubernetes.', github: 'marcus-webb' },
  { id: 'e-3', name: 'Aisha Okonkwo', title: 'Frontend Engineer', location: 'Remote', bio: 'React and TypeScript specialist. Design systems nerd.', github: 'aisha-dev' },
  { id: 'e-4', name: 'Leo Tanaka', title: 'Full Stack Engineer', location: 'San Francisco, CA', bio: 'Rails + React dev. Worked on core checkout at Shopify.', github: 'leo-tanaka' },
  { id: 'e-5', name: 'Sofia Reyes', title: 'Data Engineer', location: 'Austin, TX', bio: 'Pipeline and ML infra. Spark, Kafka, Python all day.', github: 'sofia-data' },
  { id: 'e-6', name: 'Dmitri Volkov', title: 'Backend Engineer', location: 'Remote', bio: 'Elixir and Go. Built real-time collaboration at Linear.', github: 'dmitri-v' },
  { id: 'e-7', name: 'Yara Hassan', title: 'DevOps Engineer', location: 'London, UK', bio: 'Kubernetes, Terraform, AWS. Making deploys boring is my passion.', github: 'yara-ops' },
  { id: 'e-8', name: 'Jordan Kim', title: 'Senior Full Stack Engineer', location: 'Toronto, ON', bio: 'Node and React. Built the Shopify admin from scratch.', github: 'jkim-dev' },
  { id: 'e-9', name: 'Fatima Al-Rashid', title: 'ML Engineer', location: 'San Francisco, CA', bio: 'ML infra and model training pipelines. Python and Rust.', github: 'fatima-ml' },
  { id: 'e-10', name: 'Carlos Mendez', title: 'Backend Engineer', location: 'Miami, FL', bio: 'Fintech infra at Plaid and Ramp. PostgreSQL power user.', github: 'carlos-m' },
  { id: 'e-11', name: 'Sasha Petrov', title: 'Systems Engineer', location: 'Remote', bio: 'Rust and Go. Low-latency networking at Fly.io.', github: 'sasha-sys' },
  { id: 'e-12', name: 'Nadia Chukwu', title: 'Frontend Engineer', location: 'Lagos, NG', bio: 'Vue and TypeScript. Figma plugin ecosystem contributor.', github: 'nadia-fe' },
  { id: 'e-13', name: 'Oliver Grant', title: 'Staff Backend Engineer', location: 'San Francisco, CA', bio: 'GraphQL platform at Shopify. API design and performance.', github: 'oliver-g' },
  { id: 'e-14', name: 'Amara Singh', title: 'DevOps / SRE', location: 'Seattle, WA', bio: 'Reliability engineering at scale. AWS, Terraform, and on-call.', github: 'amara-sre' },
  { id: 'e-15', name: 'Ben Larsson', title: 'Full Stack Engineer', location: 'Stockholm, SE', bio: "Notion's editor team. React and Node with a focus on performance.", github: 'ben-l' },
  { id: 'e-16', name: 'Keiko Yamamoto', title: 'Backend Engineer', location: 'Tokyo, JP', bio: 'Rails and PostgreSQL. API design at its core.', github: 'keiko-y' },
  { id: 'e-17', name: 'Raj Patel', title: 'Data Engineer', location: 'New York, NY', bio: 'Kafka and Spark for real-time analytics at Ramp.', github: 'raj-data' },
  { id: 'e-18', name: 'Lucia Morales', title: 'Senior Frontend Engineer', location: 'Barcelona, ES', bio: 'React and GraphQL. Figma-to-code pipeline builder.', github: 'lucia-m' },
  { id: 'e-19', name: 'Tunde Adeyemi', title: 'Platform Engineer', location: 'Remote', bio: 'Developer experience and internal tooling. Go and Docker.', github: 'tunde-a' },
  { id: 'e-20', name: 'Mei Lin', title: 'Backend Engineer', location: 'San Francisco, CA', bio: 'Python and ML pipelines. Stripe ML team alum.', github: 'mei-lin' },
  { id: 'e-21', name: 'Erik Strand', title: 'Senior DevOps Engineer', location: 'Remote', bio: 'GCP and Terraform. Render infrastructure team lead.', github: 'erik-s' },
  { id: 'e-22', name: 'Zainab Musa', title: 'Full Stack Engineer', location: 'Nairobi, KE', bio: 'Node and React. Built payment flows for African markets.', github: 'zainab-m' },
  { id: 'e-23', name: 'Viktor Petrov', title: 'Backend Engineer', location: 'Berlin, DE', bio: 'Go and Kafka. Event-driven architecture enthusiast.', github: 'viktor-p' },
  { id: 'e-24', name: 'Isabel Costa', title: 'Senior ML Engineer', location: 'Lisbon, PT', bio: 'Python and Spark. Large-scale model training and evaluation.', github: 'isabel-c' },
  { id: 'e-25', name: 'Drew Wilson', title: 'Staff Engineer', location: 'Austin, TX', bio: 'Rust systems programming. Compiler and runtime work.', github: 'drew-w' },
  { id: 'e-26', name: 'Hana Novak', title: 'Frontend Engineer', location: 'Prague, CZ', bio: 'React and CSS. Accessibility and animation.', github: 'hana-n' },
  { id: 'e-27', name: 'Kwame Asante', title: 'DevOps Engineer', location: 'Accra, GH', bio: 'Docker and Kubernetes. Container orchestration at scale.', github: 'kwame-a' },
  { id: 'e-28', name: 'Rin Yoshida', title: 'Backend Engineer', location: 'Remote', bio: 'Elixir and Phoenix. Real-time systems.', github: 'rin-y' },
  { id: 'e-29', name: 'Marco Ferrari', title: 'Senior Backend Engineer', location: 'Milan, IT', bio: 'Node.js and PostgreSQL. E-commerce platform scaling.', github: 'marco-f' },
  { id: 'e-30', name: 'Anika Reyes', title: 'Full Stack Engineer', location: 'Remote', bio: 'Rails and React. Startup generalist. Plaid API integrations.', github: 'anika-r' },
];

const engineerSkills = [
  { eng: 'e-1', skill: 's-rails', level: 'senior', years: 5 },
  { eng: 'e-1', skill: 's-postgres', level: 'senior', years: 6 },
  { eng: 'e-1', skill: 's-redis', level: 'mid', years: 4 },
  { eng: 'e-1', skill: 's-docker', level: 'mid', years: 3 },
  { eng: 'e-2', skill: 's-go', level: 'senior', years: 6 },
  { eng: 'e-2', skill: 's-k8s', level: 'senior', years: 5 },
  { eng: 'e-2', skill: 's-aws', level: 'senior', years: 7 },
  { eng: 'e-2', skill: 's-docker', level: 'senior', years: 5 },
  { eng: 'e-3', skill: 's-react', level: 'senior', years: 5 },
  { eng: 'e-3', skill: 's-ts', level: 'senior', years: 4 },
  { eng: 'e-3', skill: 's-graphql', level: 'mid', years: 2 },
  { eng: 'e-4', skill: 's-rails', level: 'senior', years: 6 },
  { eng: 'e-4', skill: 's-react', level: 'mid', years: 3 },
  { eng: 'e-4', skill: 's-postgres', level: 'senior', years: 5 },
  { eng: 'e-4', skill: 's-redis', level: 'mid', years: 3 },
  { eng: 'e-5', skill: 's-python', level: 'senior', years: 7 },
  { eng: 'e-5', skill: 's-spark', level: 'senior', years: 4 },
  { eng: 'e-5', skill: 's-kafka', level: 'senior', years: 3 },
  { eng: 'e-5', skill: 's-aws', level: 'mid', years: 2 },
  { eng: 'e-6', skill: 's-elixir', level: 'senior', years: 5 },
  { eng: 'e-6', skill: 's-go', level: 'mid', years: 2 },
  { eng: 'e-6', skill: 's-postgres', level: 'mid', years: 4 },
  { eng: 'e-7', skill: 's-k8s', level: 'senior', years: 6 },
  { eng: 'e-7', skill: 's-terraform', level: 'senior', years: 5 },
  { eng: 'e-7', skill: 's-aws', level: 'senior', years: 7 },
  { eng: 'e-7', skill: 's-docker', level: 'senior', years: 6 },
  { eng: 'e-8', skill: 's-node', level: 'senior', years: 5 },
  { eng: 'e-8', skill: 's-react', level: 'senior', years: 6 },
  { eng: 'e-8', skill: 's-ts', level: 'senior', years: 4 },
  { eng: 'e-8', skill: 's-postgres', level: 'mid', years: 3 },
  { eng: 'e-9', skill: 's-python', level: 'senior', years: 6 },
  { eng: 'e-9', skill: 's-ml', level: 'senior', years: 5 },
  { eng: 'e-9', skill: 's-rust', level: 'mid', years: 2 },
  { eng: 'e-9', skill: 's-aws', level: 'mid', years: 3 },
  { eng: 'e-10', skill: 's-rails', level: 'mid', years: 3 },
  { eng: 'e-10', skill: 's-postgres', level: 'senior', years: 6 },
  { eng: 'e-10', skill: 's-redis', level: 'senior', years: 4 },
  { eng: 'e-10', skill: 's-go', level: 'junior', years: 1 },
  { eng: 'e-11', skill: 's-rust', level: 'senior', years: 4 },
  { eng: 'e-11', skill: 's-go', level: 'senior', years: 5 },
  { eng: 'e-11', skill: 's-docker', level: 'senior', years: 4 },
  { eng: 'e-12', skill: 's-vue', level: 'senior', years: 5 },
  { eng: 'e-12', skill: 's-ts', level: 'senior', years: 4 },
  { eng: 'e-12', skill: 's-graphql', level: 'mid', years: 2 },
  { eng: 'e-13', skill: 's-graphql', level: 'senior', years: 6 },
  { eng: 'e-13', skill: 's-rails', level: 'senior', years: 7 },
  { eng: 'e-13', skill: 's-postgres', level: 'senior', years: 7 },
  { eng: 'e-13', skill: 's-redis', level: 'senior', years: 5 },
  { eng: 'e-14', skill: 's-aws', level: 'senior', years: 8 },
  { eng: 'e-14', skill: 's-terraform', level: 'senior', years: 6 },
  { eng: 'e-14', skill: 's-k8s', level: 'senior', years: 5 },
  { eng: 'e-15', skill: 's-react', level: 'senior', years: 5 },
  { eng: 'e-15', skill: 's-node', level: 'senior', years: 5 },
  { eng: 'e-15', skill: 's-ts', level: 'senior', years: 4 },
  { eng: 'e-15', skill: 's-postgres', level: 'mid', years: 3 },
  { eng: 'e-16', skill: 's-rails', level: 'senior', years: 8 },
  { eng: 'e-16', skill: 's-postgres', level: 'senior', years: 8 },
  { eng: 'e-16', skill: 's-redis', level: 'senior', years: 5 },
  { eng: 'e-17', skill: 's-kafka', level: 'senior', years: 5 },
  { eng: 'e-17', skill: 's-spark', level: 'senior', years: 4 },
  { eng: 'e-17', skill: 's-python', level: 'mid', years: 4 },
  { eng: 'e-17', skill: 's-aws', level: 'mid', years: 3 },
  { eng: 'e-18', skill: 's-react', level: 'senior', years: 6 },
  { eng: 'e-18', skill: 's-graphql', level: 'senior', years: 4 },
  { eng: 'e-18', skill: 's-ts', level: 'senior', years: 5 },
  { eng: 'e-19', skill: 's-go', level: 'senior', years: 5 },
  { eng: 'e-19', skill: 's-docker', level: 'senior', years: 5 },
  { eng: 'e-19', skill: 's-k8s', level: 'mid', years: 3 },
  { eng: 'e-20', skill: 's-python', level: 'senior', years: 6 },
  { eng: 'e-20', skill: 's-ml', level: 'senior', years: 4 },
  { eng: 'e-20', skill: 's-aws', level: 'mid', years: 3 },
  { eng: 'e-21', skill: 's-gcp', level: 'senior', years: 6 },
  { eng: 'e-21', skill: 's-terraform', level: 'senior', years: 6 },
  { eng: 'e-21', skill: 's-k8s', level: 'senior', years: 5 },
  { eng: 'e-21', skill: 's-docker', level: 'senior', years: 5 },
  { eng: 'e-22', skill: 's-node', level: 'senior', years: 5 },
  { eng: 'e-22', skill: 's-react', level: 'mid', years: 3 },
  { eng: 'e-22', skill: 's-postgres', level: 'mid', years: 3 },
  { eng: 'e-23', skill: 's-go', level: 'senior', years: 6 },
  { eng: 'e-23', skill: 's-kafka', level: 'senior', years: 4 },
  { eng: 'e-23', skill: 's-docker', level: 'senior', years: 5 },
  { eng: 'e-24', skill: 's-python', level: 'senior', years: 7 },
  { eng: 'e-24', skill: 's-ml', level: 'senior', years: 6 },
  { eng: 'e-24', skill: 's-spark', level: 'senior', years: 4 },
  { eng: 'e-25', skill: 's-rust', level: 'senior', years: 5 },
  { eng: 'e-25', skill: 's-go', level: 'senior', years: 4 },
  { eng: 'e-25', skill: 's-docker', level: 'mid', years: 3 },
  { eng: 'e-26', skill: 's-react', level: 'senior', years: 5 },
  { eng: 'e-26', skill: 's-ts', level: 'senior', years: 4 },
  { eng: 'e-26', skill: 's-vue', level: 'mid', years: 2 },
  { eng: 'e-27', skill: 's-k8s', level: 'senior', years: 5 },
  { eng: 'e-27', skill: 's-docker', level: 'senior', years: 6 },
  { eng: 'e-27', skill: 's-aws', level: 'mid', years: 3 },
  { eng: 'e-28', skill: 's-elixir', level: 'senior', years: 6 },
  { eng: 'e-28', skill: 's-postgres', level: 'mid', years: 4 },
  { eng: 'e-28', skill: 's-redis', level: 'mid', years: 3 },
  { eng: 'e-29', skill: 's-node', level: 'senior', years: 7 },
  { eng: 'e-29', skill: 's-postgres', level: 'senior', years: 7 },
  { eng: 'e-29', skill: 's-redis', level: 'senior', years: 5 },
  { eng: 'e-30', skill: 's-rails', level: 'mid', years: 3 },
  { eng: 'e-30', skill: 's-react', level: 'mid', years: 3 },
  { eng: 'e-30', skill: 's-postgres', level: 'mid', years: 3 },
];

const engineerCompanies = [
  { eng: 'e-1', co: 'c-stripe', role: 'Backend Engineer', from: '2019-03', to: '2022-08' },
  { eng: 'e-1', co: 'c-linear', role: 'Senior Backend Engineer', from: '2022-09', to: null },
  { eng: 'e-2', co: 'c-stripe', role: 'Infrastructure Engineer', from: '2017-06', to: '2021-04' },
  { eng: 'e-2', co: 'c-ramp', role: 'Staff Engineer', from: '2021-05', to: null },
  { eng: 'e-3', co: 'c-figma', role: 'Frontend Engineer', from: '2020-02', to: '2023-05' },
  { eng: 'e-3', co: 'c-vercel', role: 'Frontend Engineer', from: '2023-06', to: null },
  { eng: 'e-4', co: 'c-shopify', role: 'Full Stack Engineer', from: '2018-07', to: '2023-01' },
  { eng: 'e-4', co: 'c-linear', role: 'Senior Full Stack Engineer', from: '2023-02', to: null },
  { eng: 'e-5', co: 'c-stripe', role: 'Data Engineer', from: '2020-01', to: null },
  { eng: 'e-6', co: 'c-linear', role: 'Backend Engineer', from: '2021-04', to: null },
  { eng: 'e-7', co: 'c-shopify', role: 'DevOps Engineer', from: '2018-05', to: '2022-11' },
  { eng: 'e-7', co: 'c-vercel', role: 'Senior DevOps Engineer', from: '2022-12', to: null },
  { eng: 'e-8', co: 'c-shopify', role: 'Full Stack Engineer', from: '2017-09', to: null },
  { eng: 'e-9', co: 'c-stripe', role: 'ML Engineer', from: '2021-06', to: null },
  { eng: 'e-10', co: 'c-plaid', role: 'Backend Engineer', from: '2019-11', to: '2022-05' },
  { eng: 'e-10', co: 'c-ramp', role: 'Backend Engineer', from: '2022-06', to: null },
  { eng: 'e-11', co: 'c-fly', role: 'Systems Engineer', from: '2022-03', to: null },
  { eng: 'e-12', co: 'c-figma', role: 'Frontend Engineer', from: '2021-07', to: null },
  { eng: 'e-13', co: 'c-shopify', role: 'Staff Backend Engineer', from: '2016-03', to: null },
  { eng: 'e-14', co: 'c-stripe', role: 'SRE', from: '2019-08', to: '2023-02' },
  { eng: 'e-14', co: 'c-render', role: 'Senior SRE', from: '2023-03', to: null },
  { eng: 'e-15', co: 'c-notion', role: 'Full Stack Engineer', from: '2020-10', to: null },
  { eng: 'e-16', co: 'c-shopify', role: 'Backend Engineer', from: '2015-04', to: '2021-03' },
  { eng: 'e-16', co: 'c-stripe', role: 'Senior Backend Engineer', from: '2021-04', to: null },
  { eng: 'e-17', co: 'c-ramp', role: 'Data Engineer', from: '2021-09', to: null },
  { eng: 'e-18', co: 'c-figma', role: 'Senior Frontend Engineer', from: '2020-04', to: null },
  { eng: 'e-19', co: 'c-fly', role: 'Platform Engineer', from: '2021-11', to: null },
  { eng: 'e-20', co: 'c-stripe', role: 'ML Engineer', from: '2020-07', to: null },
  { eng: 'e-21', co: 'c-render', role: 'Senior DevOps Engineer', from: '2021-06', to: null },
  { eng: 'e-22', co: 'c-plaid', role: 'Full Stack Engineer', from: '2022-01', to: null },
  { eng: 'e-23', co: 'c-shopify', role: 'Backend Engineer', from: '2019-05', to: '2023-06' },
  { eng: 'e-23', co: 'c-linear', role: 'Backend Engineer', from: '2023-07', to: null },
  { eng: 'e-24', co: 'c-stripe', role: 'Senior ML Engineer', from: '2020-03', to: null },
  { eng: 'e-25', co: 'c-fly', role: 'Staff Engineer', from: '2022-06', to: null },
  { eng: 'e-26', co: 'c-notion', role: 'Frontend Engineer', from: '2021-03', to: null },
  { eng: 'e-27', co: 'c-render', role: 'DevOps Engineer', from: '2022-09', to: null },
  { eng: 'e-28', co: 'c-linear', role: 'Backend Engineer', from: '2022-01', to: null },
  { eng: 'e-29', co: 'c-shopify', role: 'Senior Backend Engineer', from: '2018-02', to: '2022-10' },
  { eng: 'e-29', co: 'c-notion', role: 'Senior Backend Engineer', from: '2022-11', to: null },
  { eng: 'e-30', co: 'c-plaid', role: 'Full Stack Engineer', from: '2023-02', to: null },
];

const projects = [
  { id: 'p-1', name: 'PayStream API', description: 'Real-time payment event streaming with sub-100ms latency', skills: ['s-rails', 's-kafka', 's-redis'], eng: 'e-1' },
  { id: 'p-2', name: 'K8s Cost Optimizer', description: 'Kubernetes resource right-sizing using historical usage data', skills: ['s-k8s', 's-go', 's-aws'], eng: 'e-2' },
  { id: 'p-3', name: 'DS Component Library', description: 'Accessible design system used across 3 product teams', skills: ['s-react', 's-ts'], eng: 'e-3' },
  { id: 'p-4', name: 'Checkout v2', description: 'Full rewrite of Shopify merchant checkout flow', skills: ['s-rails', 's-react', 's-postgres'], eng: 'e-4' },
  { id: 'p-5', name: 'ML Feature Store', description: 'Low-latency feature serving for 50+ production ML models', skills: ['s-python', 's-spark', 's-redis'], eng: 'e-5' },
  { id: 'p-6', name: 'Presence Engine', description: 'Elixir-based real-time presence system for 100k concurrent users', skills: ['s-elixir', 's-postgres'], eng: 'e-6' },
  { id: 'p-7', name: 'Zero-downtime Deploy', description: 'Blue-green deployment system with automated traffic shifting', skills: ['s-k8s', 's-terraform', 's-docker'], eng: 'e-7' },
  { id: 'p-8', name: 'Admin Dashboard', description: 'Shopify merchant admin rebuilt with modern React and TypeScript', skills: ['s-react', 's-node', 's-ts'], eng: 'e-8' },
  { id: 'p-9', name: 'Fraud Detection Model', description: 'Real-time ML fraud detection serving 500k TPS at Stripe', skills: ['s-python', 's-ml', 's-rust'], eng: 'e-9' },
  { id: 'p-10', name: 'ACH Bridge', description: 'Idempotent ACH transaction processing with automatic retries', skills: ['s-rails', 's-postgres', 's-redis'], eng: 'e-10' },
  { id: 'p-11', name: 'anycast Router', description: 'Global anycast routing layer for sub-5ms edge response', skills: ['s-rust', 's-go'], eng: 'e-11' },
  { id: 'p-12', name: 'Plugin SDK', description: 'TypeScript SDK powering the Figma plugin marketplace', skills: ['s-ts', 's-graphql'], eng: 'e-12' },
  { id: 'p-13', name: 'Storefront GraphQL', description: 'Public-facing Shopify Storefront API used by 1M merchants', skills: ['s-graphql', 's-rails', 's-redis'], eng: 'e-13' },
  { id: 'p-14', name: 'Observability Stack', description: 'End-to-end observability platform replacing 3 vendor tools', skills: ['s-aws', 's-terraform', 's-k8s'], eng: 'e-14' },
  { id: 'p-15', name: 'Block Editor', description: 'Collaborative block-based editor with offline sync', skills: ['s-react', 's-node', 's-ts'], eng: 'e-15' },
];

const knows = [
  ['e-1', 'e-2'], ['e-1', 'e-9'], ['e-1', 'e-16'],
  ['e-2', 'e-7'], ['e-2', 'e-14'],
  ['e-3', 'e-12'], ['e-3', 'e-18'], ['e-3', 'e-26'],
  ['e-4', 'e-6'], ['e-4', 'e-8'], ['e-4', 'e-13'],
  ['e-5', 'e-17'], ['e-5', 'e-24'],
  ['e-6', 'e-28'], ['e-7', 'e-21'], ['e-7', 'e-27'],
  ['e-8', 'e-15'], ['e-9', 'e-20'], ['e-9', 'e-24'],
  ['e-10', 'e-22'], ['e-11', 'e-19'], ['e-11', 'e-25'],
  ['e-13', 'e-23'], ['e-14', 'e-21'],
];

const roles = [
  {
    id: 'r-1', title: 'Senior Backend Engineer', company: 'c-stripe',
    remote: false, salaryRange: '$180k–$240k', seniority: 'senior',
    requiredSkills: ['s-rails', 's-postgres', 's-redis'],
  },
  {
    id: 'r-2', title: 'Staff DevOps Engineer', company: 'c-shopify',
    remote: true, salaryRange: '$200k–$270k', seniority: 'staff',
    requiredSkills: ['s-k8s', 's-terraform', 's-aws', 's-docker'],
  },
  {
    id: 'r-3', title: 'Senior ML Engineer', company: 'c-plaid',
    remote: false, salaryRange: '$190k–$250k', seniority: 'senior',
    requiredSkills: ['s-python', 's-ml', 's-aws'],
  },
  {
    id: 'r-4', title: 'Frontend Engineer', company: 'c-linear',
    remote: true, salaryRange: '$140k–$190k', seniority: 'mid',
    requiredSkills: ['s-react', 's-ts', 's-graphql'],
  },
  {
    id: 'r-5', title: 'Data Engineer', company: 'c-ramp',
    remote: false, salaryRange: '$160k–$210k', seniority: 'mid',
    requiredSkills: ['s-kafka', 's-spark', 's-python'],
  },
  {
    id: 'r-6', title: 'Systems Engineer', company: 'c-fly',
    remote: true, salaryRange: '$170k–$230k', seniority: 'senior',
    requiredSkills: ['s-rust', 's-go', 's-docker'],
  },
  {
    id: 'r-7', title: 'Full Stack Engineer', company: 'c-notion',
    remote: true, salaryRange: '$150k–$200k', seniority: 'mid',
    requiredSkills: ['s-react', 's-node', 's-ts', 's-postgres'],
  },
  {
    id: 'r-8', title: 'Senior SRE', company: 'c-render',
    remote: true, salaryRange: '$175k–$230k', seniority: 'senior',
    requiredSkills: ['s-k8s', 's-terraform', 's-gcp'],
  },
];

async function seed() {
  const session = driver.session();
  try {
    console.log('Clearing existing data...');
    await session.run('MATCH (n) DETACH DELETE n');

    console.log('Creating skills...');
    for (const s of skills) {
      await session.run(
        'CREATE (n:Skill {id: $id, name: $name, category: $category})',
        s
      );
    }

    console.log('Creating companies...');
    for (const c of companies) {
      await session.run(
        'CREATE (n:Company {id: $id, name: $name, industry: $industry, size: $size, location: $location})',
        c
      );
    }

    console.log('Creating engineers...');
    for (const e of engineers) {
      await session.run(
        `CREATE (n:Engineer {id: $id, name: $name, title: $title, location: $location,
         bio: $bio, github: $github, avatar: $avatar})`,
        { ...e, avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(e.name)}` }
      );
    }

    console.log('Creating engineer–skill relationships...');
    for (const es of engineerSkills) {
      await session.run(
        `MATCH (e:Engineer {id: $eng}), (s:Skill {id: $skill})
         CREATE (e)-[:HAS_SKILL {level: $level, years: $years}]->(s)`,
        es
      );
    }

    console.log('Creating engineer–company relationships...');
    for (const ec of engineerCompanies) {
      await session.run(
        `MATCH (e:Engineer {id: $eng}), (c:Company {id: $co})
         CREATE (e)-[:WORKED_AT {role: $role, from: $from, to: $to}]->(c)`,
        ec
      );
    }

    console.log('Creating projects...');
    for (const p of projects) {
      await session.run(
        `MATCH (e:Engineer {id: $eng})
         CREATE (proj:Project {id: $id, name: $name, description: $description})
         CREATE (e)-[:BUILT]->(proj)`,
        p
      );
      for (const skillId of p.skills) {
        await session.run(
          `MATCH (proj:Project {id: $pid}), (s:Skill {id: $sid})
           CREATE (proj)-[:USES]->(s)`,
          { pid: p.id, sid: skillId }
        );
      }
    }

    console.log('Creating KNOWS relationships...');
    for (const [a, b] of knows) {
      await session.run(
        `MATCH (a:Engineer {id: $a}), (b:Engineer {id: $b})
         CREATE (a)-[:KNOWS]->(b), (b)-[:KNOWS]->(a)`,
        { a, b }
      );
    }

    console.log('Creating roles...');
    for (const r of roles) {
      await session.run(
        `MATCH (c:Company {id: $company})
         CREATE (role:Role {id: $id, title: $title, remote: $remote, salaryRange: $salaryRange, seniority: $seniority})
         CREATE (c)-[:HAS_ROLE]->(role)`,
        r
      );
      for (const skillId of r.requiredSkills) {
        await session.run(
          `MATCH (role:Role {id: $rid}), (s:Skill {id: $sid})
           CREATE (role)-[:REQUIRES_SKILL]->(s)`,
          { rid: r.id, sid: skillId }
        );
      }
    }

    console.log('Creating indexes...');
    await session.run('CREATE INDEX engineer_id IF NOT EXISTS FOR (e:Engineer) ON (e.id)');
    await session.run('CREATE INDEX skill_id IF NOT EXISTS FOR (s:Skill) ON (s.id)');
    await session.run('CREATE INDEX company_id IF NOT EXISTS FOR (c:Company) ON (c.id)');
    await session.run('CREATE INDEX role_id IF NOT EXISTS FOR (r:Role) ON (r.id)');

    console.log('\nSeed complete!');
    console.log(`  ${engineers.length} engineers`);
    console.log(`  ${skills.length} skills`);
    console.log(`  ${companies.length} companies`);
    console.log(`  ${projects.length} projects`);
    console.log(`  ${roles.length} open roles`);
  } finally {
    await session.close();
    await driver.close();
  }
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
