import type { Tool } from '@/types'

export const DEFAULT_TOOLS: Omit<Tool, '$id' | '$createdAt'>[] = [
  // ─── Languages ─────────────────────────────────────────────────────────────
  { name: 'JavaScript', description: 'The language of the web', category: 'frontend', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', icon: '', color: '#f7df1e', tags: ['language', 'web'], userId: 'dev-user', isPublic: true },
  { name: 'TypeScript', description: 'JavaScript with syntax for types', category: 'frontend', url: 'https://www.typescriptlang.org', icon: '', color: '#3178c6', tags: ['language', 'types'], userId: 'dev-user', isPublic: true },
  { name: 'Python', description: 'General-purpose programming language', category: 'backend', url: 'https://www.python.org', icon: '', color: '#3776ab', tags: ['language', 'scripting'], userId: 'dev-user', isPublic: true },
  { name: 'Go', description: 'Open source language by Google', category: 'backend', url: 'https://go.dev', icon: '', color: '#00add8', tags: ['language', 'systems'], userId: 'dev-user', isPublic: true },
  { name: 'Rust', description: 'A language empowering everyone', category: 'backend', url: 'https://www.rust-lang.org', icon: '', color: '#dea584', tags: ['language', 'systems', 'performance'], userId: 'dev-user', isPublic: true },
  { name: 'Java', description: 'Write once, run anywhere', category: 'backend', url: 'https://www.java.com', icon: '', color: '#f89820', tags: ['language', 'enterprise'], userId: 'dev-user', isPublic: true },
  { name: 'C++', description: 'High-performance systems language', category: 'backend', url: 'https://isocpp.org', icon: '', color: '#00599c', tags: ['language', 'systems'], userId: 'dev-user', isPublic: true },
  { name: 'C#', description: 'Modern object-oriented language by Microsoft', category: 'backend', url: 'https://learn.microsoft.com/dotnet/csharp', icon: '', color: '#68217a', tags: ['language', 'dotnet'], userId: 'dev-user', isPublic: true },
  { name: 'Ruby', description: 'A programmer\'s best friend', category: 'backend', url: 'https://www.ruby-lang.org', icon: '', color: '#cc342d', tags: ['language', 'scripting'], userId: 'dev-user', isPublic: true },
  { name: 'PHP', description: 'Server-side scripting language', category: 'backend', url: 'https://www.php.net', icon: '', color: '#777bb4', tags: ['language', 'web'], userId: 'dev-user', isPublic: true },
  { name: 'Swift', description: 'Powerful language for Apple platforms', category: 'frontend', url: 'https://swift.org', icon: '', color: '#f05138', tags: ['language', 'mobile', 'ios'], userId: 'dev-user', isPublic: true },
  { name: 'Kotlin', description: 'Modern language for JVM and Android', category: 'backend', url: 'https://kotlinlang.org', icon: '', color: '#7f52ff', tags: ['language', 'android', 'jvm'], userId: 'dev-user', isPublic: true },
  { name: 'Dart', description: 'Language optimized for client apps', category: 'frontend', url: 'https://dart.dev', icon: '', color: '#0175c2', tags: ['language', 'flutter'], userId: 'dev-user', isPublic: true },
  { name: 'Elixir', description: 'Dynamic functional language for scalable apps', category: 'backend', url: 'https://elixir-lang.org', icon: '', color: '#6e4a7e', tags: ['language', 'functional', 'erlang'], userId: 'dev-user', isPublic: true },
  { name: 'Zig', description: 'General-purpose language and toolchain', category: 'backend', url: 'https://ziglang.org', icon: '', color: '#f7a41d', tags: ['language', 'systems'], userId: 'dev-user', isPublic: true },

  // ─── Databases ─────────────────────────────────────────────────────────────
  { name: 'PostgreSQL', description: 'Advanced open source relational database', category: 'database', url: 'https://www.postgresql.org', icon: '', color: '#336791', tags: ['sql', 'relational'], userId: 'dev-user', isPublic: true },
  { name: 'MySQL', description: 'World\'s most popular open source database', category: 'database', url: 'https://www.mysql.com', icon: '', color: '#4479a1', tags: ['sql', 'relational'], userId: 'dev-user', isPublic: true },
  { name: 'MongoDB', description: 'Document-based distributed database', category: 'database', url: 'https://www.mongodb.com', icon: '', color: '#47a248', tags: ['nosql', 'document'], userId: 'dev-user', isPublic: true },
  { name: 'Redis', description: 'In-memory data structure store', category: 'database', url: 'https://redis.io', icon: '', color: '#dc382d', tags: ['cache', 'in-memory', 'nosql'], userId: 'dev-user', isPublic: true },
  { name: 'SQLite', description: 'Small, fast, self-contained SQL engine', category: 'database', url: 'https://www.sqlite.org', icon: '', color: '#003b57', tags: ['sql', 'embedded', 'lightweight'], userId: 'dev-user', isPublic: true },
  { name: 'DynamoDB', description: 'Fully managed NoSQL database by AWS', category: 'database', url: 'https://aws.amazon.com/dynamodb', icon: '', color: '#4053d6', tags: ['nosql', 'aws', 'serverless'], userId: 'dev-user', isPublic: true },
  { name: 'Supabase', description: 'Open source Firebase alternative', category: 'database', url: 'https://supabase.com', icon: '', color: '#3ecf8e', tags: ['postgres', 'baas', 'realtime'], userId: 'dev-user', isPublic: true },
  { name: 'Firebase', description: 'Google\'s mobile and web app platform', category: 'database', url: 'https://firebase.google.com', icon: '', color: '#ffca28', tags: ['baas', 'realtime', 'google'], userId: 'dev-user', isPublic: true },
  { name: 'Elasticsearch', description: 'Distributed search and analytics engine', category: 'database', url: 'https://www.elastic.co/elasticsearch', icon: '', color: '#005571', tags: ['search', 'analytics', 'nosql'], userId: 'dev-user', isPublic: true },
  { name: 'Cassandra', description: 'Distributed wide-column NoSQL database', category: 'database', url: 'https://cassandra.apache.org', icon: '', color: '#1287b1', tags: ['nosql', 'distributed', 'wide-column'], userId: 'dev-user', isPublic: true },
  { name: 'PlanetScale', description: 'Serverless MySQL platform', category: 'database', url: 'https://planetscale.com', icon: '', color: '#000000', tags: ['mysql', 'serverless', 'scaling'], userId: 'dev-user', isPublic: true },
  { name: 'Neon', description: 'Serverless Postgres built for the cloud', category: 'database', url: 'https://neon.tech', icon: '', color: '#000000', tags: ['postgres', 'serverless', 'branching'], userId: 'dev-user', isPublic: true },
  { name: 'CockroachDB', description: 'Distributed SQL database', category: 'database', url: 'https://www.cockroachlabs.com', icon: '', color: '#6933ff', tags: ['sql', 'distributed', 'resilient'], userId: 'dev-user', isPublic: true },
  { name: 'Neo4j', description: 'Graph database and analytics platform', category: 'database', url: 'https://neo4j.com', icon: '', color: '#008cc1', tags: ['graph', 'nosql', 'relationships'], userId: 'dev-user', isPublic: true },
  { name: 'InfluxDB', description: 'Time series database', category: 'database', url: 'https://www.influxdata.com', icon: '', color: '#22adf6', tags: ['time-series', 'metrics', 'iot'], userId: 'dev-user', isPublic: true },

  // ─── Frontend Frameworks ───────────────────────────────────────────────────
  { name: 'React', description: 'Library for building user interfaces', category: 'frontend', url: 'https://react.dev', icon: '', color: '#61dafb', tags: ['framework', 'ui', 'components'], userId: 'dev-user', isPublic: true },
  { name: 'Next.js', description: 'The React framework for the web', category: 'frontend', url: 'https://nextjs.org', icon: '', color: '#ffffff', tags: ['framework', 'ssr', 'react', 'fullstack'], userId: 'dev-user', isPublic: true },
  { name: 'Vue', description: 'Progressive JavaScript framework', category: 'frontend', url: 'https://vuejs.org', icon: '', color: '#42b883', tags: ['framework', 'ui', 'reactive'], userId: 'dev-user', isPublic: true },
  { name: 'Nuxt', description: 'The intuitive Vue framework', category: 'frontend', url: 'https://nuxt.com', icon: '', color: '#00dc82', tags: ['framework', 'ssr', 'vue', 'fullstack'], userId: 'dev-user', isPublic: true },
  { name: 'Svelte', description: 'Cybernetically enhanced web apps', category: 'frontend', url: 'https://svelte.dev', icon: '', color: '#ff3e00', tags: ['framework', 'compiler', 'ui'], userId: 'dev-user', isPublic: true },
  { name: 'SvelteKit', description: 'Web development framework for Svelte', category: 'frontend', url: 'https://kit.svelte.dev', icon: '', color: '#ff3e00', tags: ['framework', 'ssr', 'svelte'], userId: 'dev-user', isPublic: true },
  { name: 'Angular', description: 'Platform for building mobile and desktop web apps', category: 'frontend', url: 'https://angular.dev', icon: '', color: '#dd0031', tags: ['framework', 'typescript', 'enterprise'], userId: 'dev-user', isPublic: true },
  { name: 'Astro', description: 'Web framework for content-driven websites', category: 'frontend', url: 'https://astro.build', icon: '', color: '#bc52ee', tags: ['framework', 'static', 'islands'], userId: 'dev-user', isPublic: true },
  { name: 'Remix', description: 'Full stack web framework', category: 'frontend', url: 'https://remix.run', icon: '', color: '#121212', tags: ['framework', 'react', 'fullstack'], userId: 'dev-user', isPublic: true },
  { name: 'Solid.js', description: 'Simple and performant reactivity', category: 'frontend', url: 'https://www.solidjs.com', icon: '', color: '#4f88c6', tags: ['framework', 'reactive', 'ui'], userId: 'dev-user', isPublic: true },

  // ─── Frontend Libraries & Tools ────────────────────────────────────────────
  { name: 'Vite', description: 'Next generation frontend tooling', category: 'frontend', url: 'https://vitejs.dev', icon: '', color: '#646cff', tags: ['bundler', 'build', 'dev-server'], userId: 'dev-user', isPublic: true },
  { name: 'Webpack', description: 'Static module bundler', category: 'frontend', url: 'https://webpack.js.org', icon: '', color: '#8dd6f9', tags: ['bundler', 'build'], userId: 'dev-user', isPublic: true },
  { name: 'esbuild', description: 'An extremely fast JavaScript bundler', category: 'frontend', url: 'https://esbuild.github.io', icon: '', color: '#ffcf00', tags: ['bundler', 'build', 'performance'], userId: 'dev-user', isPublic: true },
  { name: 'Tailwind CSS', description: 'Utility-first CSS framework', category: 'ui', url: 'https://tailwindcss.com', icon: '', color: '#06b6d4', tags: ['css', 'utility', 'styling'], userId: 'dev-user', isPublic: true },
  { name: 'shadcn/ui', description: 'Beautifully designed components', category: 'ui', url: 'https://ui.shadcn.com', icon: '', color: '#ffffff', tags: ['components', 'react', 'radix'], userId: 'dev-user', isPublic: true },
  { name: 'Radix UI', description: 'Unstyled, accessible UI primitives', category: 'ui', url: 'https://www.radix-ui.com', icon: '', color: '#1a1a1a', tags: ['components', 'accessibility', 'primitives'], userId: 'dev-user', isPublic: true },
  { name: 'Framer Motion', description: 'Production-ready motion library for React', category: 'ui', url: 'https://www.framer.com/motion', icon: '', color: '#0055ff', tags: ['animation', 'react', 'motion'], userId: 'dev-user', isPublic: true },
  { name: 'GSAP', description: 'Professional-grade animation for the web', category: 'ui', url: 'https://gsap.com', icon: '', color: '#88ce02', tags: ['animation', 'timeline', 'scroll'], userId: 'dev-user', isPublic: true },
  { name: 'Three.js', description: '3D graphics library for the web', category: 'ui', url: 'https://threejs.org', icon: '', color: '#ffffff', tags: ['3d', 'webgl', 'graphics'], userId: 'dev-user', isPublic: true },
  { name: 'D3.js', description: 'Data-driven documents', category: 'ui', url: 'https://d3js.org', icon: '', color: '#f9a03c', tags: ['data-viz', 'svg', 'charts'], userId: 'dev-user', isPublic: true },
  { name: 'Zustand', description: 'Small, fast state management', category: 'frontend', url: 'https://zustand-demo.pmnd.rs', icon: '', color: '#7e43e3', tags: ['state', 'react', 'lightweight'], userId: 'dev-user', isPublic: true },
  { name: 'TanStack Query', description: 'Powerful async state management', category: 'frontend', url: 'https://tanstack.com/query', icon: '', color: '#ff4154', tags: ['data-fetching', 'cache', 'react'], userId: 'dev-user', isPublic: true },
  { name: 'React Hook Form', description: 'Performant forms with easy validation', category: 'frontend', url: 'https://react-hook-form.com', icon: '', color: '#ec5990', tags: ['forms', 'validation', 'react'], userId: 'dev-user', isPublic: true },
  { name: 'Zod', description: 'TypeScript-first schema validation', category: 'frontend', url: 'https://zod.dev', icon: '', color: '#3e67ec', tags: ['validation', 'schema', 'typescript'], userId: 'dev-user', isPublic: true },

  // ─── Backend Frameworks ────────────────────────────────────────────────────
  { name: 'Express', description: 'Fast, minimalist web framework for Node.js', category: 'backend', url: 'https://expressjs.com', icon: '', color: '#ffffff', tags: ['node', 'http', 'minimal'], userId: 'dev-user', isPublic: true },
  { name: 'Fastify', description: 'Fast and low overhead web framework', category: 'backend', url: 'https://fastify.dev', icon: '', color: '#000000', tags: ['node', 'http', 'performance'], userId: 'dev-user', isPublic: true },
  { name: 'NestJS', description: 'Progressive Node.js framework', category: 'backend', url: 'https://nestjs.com', icon: '', color: '#e0234e', tags: ['node', 'typescript', 'enterprise'], userId: 'dev-user', isPublic: true },
  { name: 'Hono', description: 'Ultrafast web framework for the Edges', category: 'backend', url: 'https://hono.dev', icon: '', color: '#e36002', tags: ['edge', 'serverless', 'typescript'], userId: 'dev-user', isPublic: true },
  { name: 'Django', description: 'The web framework for perfectionists', category: 'backend', url: 'https://www.djangoproject.com', icon: '', color: '#092e20', tags: ['python', 'orm', 'batteries-included'], userId: 'dev-user', isPublic: true },
  { name: 'Flask', description: 'Lightweight WSGI web application framework', category: 'backend', url: 'https://flask.palletsprojects.com', icon: '', color: '#ffffff', tags: ['python', 'micro', 'simple'], userId: 'dev-user', isPublic: true },
  { name: 'FastAPI', description: 'Modern, fast web framework for Python', category: 'backend', url: 'https://fastapi.tiangolo.com', icon: '', color: '#009688', tags: ['python', 'async', 'openapi'], userId: 'dev-user', isPublic: true },
  { name: 'Spring Boot', description: 'Java-based framework for building apps', category: 'backend', url: 'https://spring.io/projects/spring-boot', icon: '', color: '#6db33f', tags: ['java', 'enterprise', 'microservices'], userId: 'dev-user', isPublic: true },
  { name: 'Gin', description: 'HTTP web framework for Go', category: 'backend', url: 'https://gin-gonic.com', icon: '', color: '#00add8', tags: ['go', 'http', 'performance'], userId: 'dev-user', isPublic: true },
  { name: 'Actix', description: 'Powerful, pragmatic Rust web framework', category: 'backend', url: 'https://actix.rs', icon: '', color: '#000000', tags: ['rust', 'async', 'performance'], userId: 'dev-user', isPublic: true },
  { name: 'Rails', description: 'Web application framework for Ruby', category: 'backend', url: 'https://rubyonrails.org', icon: '', color: '#cc0000', tags: ['ruby', 'orm', 'convention'], userId: 'dev-user', isPublic: true },
  { name: 'Laravel', description: 'PHP framework for web artisans', category: 'backend', url: 'https://laravel.com', icon: '', color: '#ff2d20', tags: ['php', 'orm', 'elegant'], userId: 'dev-user', isPublic: true },
  { name: 'tRPC', description: 'End-to-end typesafe APIs', category: 'backend', url: 'https://trpc.io', icon: '', color: '#398ccb', tags: ['typescript', 'rpc', 'typesafe'], userId: 'dev-user', isPublic: true },

  // ─── DevOps & Infrastructure ───────────────────────────────────────────────
  { name: 'Docker', description: 'Platform for developing and running containers', category: 'devops', url: 'https://www.docker.com', icon: '', color: '#2496ed', tags: ['containers', 'virtualization'], userId: 'dev-user', isPublic: true },
  { name: 'Kubernetes', description: 'Production-grade container orchestration', category: 'devops', url: 'https://kubernetes.io', icon: '', color: '#326ce5', tags: ['orchestration', 'containers', 'scaling'], userId: 'dev-user', isPublic: true },
  { name: 'Terraform', description: 'Infrastructure as code', category: 'devops', url: 'https://www.terraform.io', icon: '', color: '#7b42bc', tags: ['iac', 'cloud', 'provisioning'], userId: 'dev-user', isPublic: true },
  { name: 'Ansible', description: 'IT automation platform', category: 'devops', url: 'https://www.ansible.com', icon: '', color: '#ee0000', tags: ['automation', 'configuration', 'ssh'], userId: 'dev-user', isPublic: true },
  { name: 'GitHub Actions', description: 'Automate your workflow from idea to production', category: 'devops', url: 'https://github.com/features/actions', icon: '', color: '#2088ff', tags: ['ci-cd', 'automation', 'github'], userId: 'dev-user', isPublic: true },
  { name: 'Vercel', description: 'Platform for frontend frameworks and static sites', category: 'devops', url: 'https://vercel.com', icon: '', color: '#ffffff', tags: ['hosting', 'serverless', 'edge'], userId: 'dev-user', isPublic: true },
  { name: 'AWS', description: 'Amazon Web Services cloud platform', category: 'devops', url: 'https://aws.amazon.com', icon: '', color: '#ff9900', tags: ['cloud', 'iaas', 'paas'], userId: 'dev-user', isPublic: true },
  { name: 'Cloudflare', description: 'Web infrastructure and security company', category: 'devops', url: 'https://www.cloudflare.com', icon: '', color: '#f38020', tags: ['cdn', 'dns', 'security', 'edge'], userId: 'dev-user', isPublic: true },
  { name: 'Nginx', description: 'High-performance HTTP server and reverse proxy', category: 'devops', url: 'https://nginx.org', icon: '', color: '#009639', tags: ['web-server', 'proxy', 'load-balancer'], userId: 'dev-user', isPublic: true },
  { name: 'Linux', description: 'Open source operating system kernel', category: 'devops', url: 'https://www.linux.org', icon: '', color: '#fcc624', tags: ['os', 'kernel', 'server'], userId: 'dev-user', isPublic: true },

  // ─── Testing ──────────────────────────────────────────────────────────────
  { name: 'Jest', description: 'Delightful JavaScript testing framework', category: 'testing', url: 'https://jestjs.io', icon: '', color: '#c21325', tags: ['unit', 'integration', 'react'], userId: 'dev-user', isPublic: true },
  { name: 'Vitest', description: 'Blazing fast unit test framework', category: 'testing', url: 'https://vitest.dev', icon: '', color: '#6e9f18', tags: ['unit', 'vite', 'typescript'], userId: 'dev-user', isPublic: true },
  { name: 'Cypress', description: 'Fast, easy and reliable testing for anything in a browser', category: 'testing', url: 'https://www.cypress.io', icon: '', color: '#17202c', tags: ['e2e', 'browser', 'integration'], userId: 'dev-user', isPublic: true },
  { name: 'Playwright', description: 'Reliable end-to-end testing for modern web apps', category: 'testing', url: 'https://playwright.dev', icon: '', color: '#2eade3', tags: ['e2e', 'cross-browser', 'automation'], userId: 'dev-user', isPublic: true },
  { name: 'Testing Library', description: 'Simple and complete testing utilities', category: 'testing', url: 'https://testing-library.com', icon: '', color: '#e33332', tags: ['unit', 'integration', 'accessibility'], userId: 'dev-user', isPublic: true },

  // ─── Auth ──────────────────────────────────────────────────────────────────
  { name: 'Auth.js', description: 'Authentication for the web (NextAuth)', category: 'auth', url: 'https://authjs.dev', icon: '', color: '#000000', tags: ['oauth', 'nextjs', 'session'], userId: 'dev-user', isPublic: true },
  { name: 'Clerk', description: 'Complete user management platform', category: 'auth', url: 'https://clerk.com', icon: '', color: '#6c47ff', tags: ['users', 'auth', 'saas'], userId: 'dev-user', isPublic: true },
  { name: 'Lucia', description: 'Simple and flexible authentication library', category: 'auth', url: 'https://lucia-auth.com', icon: '', color: '#e11d48', tags: ['auth', 'session', 'database'], userId: 'dev-user', isPublic: true },
  { name: 'Appwrite', description: 'Open source backend server', category: 'auth', url: 'https://appwrite.io', icon: '', color: '#fd366e', tags: ['baas', 'auth', 'database'], userId: 'dev-user', isPublic: true },
  { name: 'Passport.js', description: 'Authentication middleware for Node.js', category: 'auth', url: 'https://www.passportjs.org', icon: '', color: '#34e27a', tags: ['node', 'oauth', 'strategies'], userId: 'dev-user', isPublic: true },

  // ─── Monitoring & Observability ────────────────────────────────────────────
  { name: 'Sentry', description: 'Application monitoring and error tracking', category: 'monitoring', url: 'https://sentry.io', icon: '', color: '#362d59', tags: ['errors', 'performance', 'tracing'], userId: 'dev-user', isPublic: true },
  { name: 'Datadog', description: 'Monitoring and security platform', category: 'monitoring', url: 'https://www.datadoghq.com', icon: '', color: '#632ca6', tags: ['metrics', 'logs', 'apm'], userId: 'dev-user', isPublic: true },
  { name: 'Grafana', description: 'Open source analytics and monitoring', category: 'monitoring', url: 'https://grafana.com', icon: '', color: '#f46800', tags: ['dashboards', 'metrics', 'visualization'], userId: 'dev-user', isPublic: true },
  { name: 'Prometheus', description: 'Monitoring system and time series database', category: 'monitoring', url: 'https://prometheus.io', icon: '', color: '#e6522c', tags: ['metrics', 'alerting', 'time-series'], userId: 'dev-user', isPublic: true },
  { name: 'New Relic', description: 'Observability platform', category: 'monitoring', url: 'https://newrelic.com', icon: '', color: '#008c99', tags: ['apm', 'logs', 'infrastructure'], userId: 'dev-user', isPublic: true },

  // ─── ORM & Data ────────────────────────────────────────────────────────────
  { name: 'Prisma', description: 'Next-generation ORM for Node.js and TypeScript', category: 'database', url: 'https://www.prisma.io', icon: '', color: '#2d3748', tags: ['orm', 'typescript', 'schema'], userId: 'dev-user', isPublic: true },
  { name: 'Drizzle', description: 'TypeScript ORM that feels like SQL', category: 'database', url: 'https://orm.drizzle.team', icon: '', color: '#c5f74f', tags: ['orm', 'typescript', 'sql'], userId: 'dev-user', isPublic: true },
  { name: 'Sequelize', description: 'Promise-based ORM for Node.js', category: 'database', url: 'https://sequelize.org', icon: '', color: '#52b0e7', tags: ['orm', 'node', 'sql'], userId: 'dev-user', isPublic: true },
  { name: 'Mongoose', description: 'MongoDB object modeling for Node.js', category: 'database', url: 'https://mongoosejs.com', icon: '', color: '#880000', tags: ['orm', 'mongodb', 'node'], userId: 'dev-user', isPublic: true },

  // ─── API & Communication ───────────────────────────────────────────────────
  { name: 'GraphQL', description: 'Query language for your API', category: 'backend', url: 'https://graphql.org', icon: '', color: '#e10098', tags: ['api', 'query', 'schema'], userId: 'dev-user', isPublic: true },
  { name: 'Apollo', description: 'GraphQL implementation for full-stack development', category: 'backend', url: 'https://www.apollographql.com', icon: '', color: '#311c87', tags: ['graphql', 'client', 'server'], userId: 'dev-user', isPublic: true },
  { name: 'Socket.IO', description: 'Real-time bidirectional event-based communication', category: 'backend', url: 'https://socket.io', icon: '', color: '#010101', tags: ['websocket', 'realtime', 'events'], userId: 'dev-user', isPublic: true },
  { name: 'gRPC', description: 'Modern open source high performance RPC framework', category: 'backend', url: 'https://grpc.io', icon: '', color: '#2496ed', tags: ['rpc', 'protobuf', 'microservices'], userId: 'dev-user', isPublic: true },

  // ─── Package Managers & Build ──────────────────────────────────────────────
  { name: 'npm', description: 'Package manager for JavaScript', category: 'devops', url: 'https://www.npmjs.com', icon: '', color: '#cb3837', tags: ['package-manager', 'node', 'registry'], userId: 'dev-user', isPublic: true },
  { name: 'pnpm', description: 'Fast, disk space efficient package manager', category: 'devops', url: 'https://pnpm.io', icon: '', color: '#f9ad00', tags: ['package-manager', 'node', 'performance'], userId: 'dev-user', isPublic: true },
  { name: 'yarn', description: 'Fast, reliable and secure dependency management', category: 'devops', url: 'https://yarnpkg.com', icon: '', color: '#2c8ebb', tags: ['package-manager', 'node'], userId: 'dev-user', isPublic: true },
  { name: 'Turborepo', description: 'High-performance build system for monorepos', category: 'devops', url: 'https://turborepo.org', icon: '', color: '#ef4444', tags: ['monorepo', 'build', 'caching'], userId: 'dev-user', isPublic: true },

  // ─── Linting & Formatting ──────────────────────────────────────────────────
  { name: 'ESLint', description: 'Find and fix problems in your JavaScript code', category: 'testing', url: 'https://eslint.org', icon: '', color: '#4b32c3', tags: ['linting', 'code-quality', 'javascript'], userId: 'dev-user', isPublic: true },
  { name: 'Prettier', description: 'Opinionated code formatter', category: 'testing', url: 'https://prettier.io', icon: '', color: '#f7b93e', tags: ['formatting', 'code-style'], userId: 'dev-user', isPublic: true },
  { name: 'Biome', description: 'Fast formatter and linter for the web', category: 'testing', url: 'https://biomejs.dev', icon: '', color: '#60a5fa', tags: ['linting', 'formatting', 'performance'], userId: 'dev-user', isPublic: true },

  // ── Version Control ───────────────────────────────────────────────────────
  { name: 'Git', description: 'Distributed version control system', category: 'devops', url: 'https://git-scm.com', icon: '', color: '#f05032', tags: ['vcs', 'version-control', 'collaboration'], userId: 'dev-user', isPublic: true },
  { name: 'GitHub', description: 'Platform for version control and collaboration', category: 'devops', url: 'https://github.com', icon: '', color: '#ffffff', tags: ['vcs', 'hosting', 'collaboration'], userId: 'dev-user', isPublic: true },
  { name: 'GitLab', description: 'Complete DevOps platform', category: 'devops', url: 'https://gitlab.com', icon: '', color: '#fc6d26', tags: ['vcs', 'ci-cd', 'devops'], userId: 'dev-user', isPublic: true },

  // ─── Design & Prototyping ──────────────────────────────────────────────────
  { name: 'Figma', description: 'Collaborative interface design tool', category: 'ui', url: 'https://www.figma.com', icon: '', color: '#f24e1e', tags: ['design', 'prototyping', 'collaboration'], userId: 'dev-user', isPublic: true },
  { name: 'Storybook', description: 'Frontend workshop for UI development', category: 'ui', url: 'https://storybook.js.org', icon: '', color: '#ff4785', tags: ['components', 'documentation', 'testing'], userId: 'dev-user', isPublic: true },
]
