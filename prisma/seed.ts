import {Database} from '@/database';
import {PostStatus} from '@/database/prisma/enums';

interface ISeedPost {
    title: string;
    content: string;
    status: PostStatus;
}

interface ISeedTopic {
    name: string;
    description: string;
    posts: ISeedPost[];
}

const topics: ISeedTopic[] = [
    {
        name: 'Docker',
        description: 'Containers, images and everything Docker-related',
        posts: [
            {
                title: 'Getting started with Docker',
                content: 'A beginner-friendly introduction to containers.',
                status: PostStatus.published
            },
            {
                title: 'Writing efficient Dockerfiles',
                content: 'Tips for smaller, faster, more cacheable images.',
                status: PostStatus.published
            },
            {
                title: 'Docker Compose in practice',
                content: 'Composing multi-container development environments.',
                status: PostStatus.draft
            },
            {
                title: 'Multi-stage builds explained',
                content: 'Trimming final image size by separating build and runtime stages.',
                status: PostStatus.published
            },
            {
                title: 'Debugging containers in production',
                content: 'Attaching to, inspecting and profiling running containers.',
                status: PostStatus.scheduled
            },
            {
                title: 'Docker networking deep dive',
                content: 'Bridge, host and overlay networks compared.',
                status: PostStatus.draft
            }
        ]
    },
    {
        name: 'Kubernetes',
        description: 'Orchestration, deployments and cluster management',
        posts: [
            {
                title: 'Kubernetes basics',
                content: 'Pods, deployments and services explained.',
                status: PostStatus.published
            },
            {
                title: 'Scaling workloads on Kubernetes',
                content: 'Horizontal pod autoscaling and resource limits.',
                status: PostStatus.scheduled
            },
            {
                title: 'Helm charts for beginners',
                content: 'Templating Kubernetes manifests with Helm.',
                status: PostStatus.draft
            },
            {
                title: 'Kubernetes networking with services',
                content: 'ClusterIP, NodePort and LoadBalancer compared.',
                status: PostStatus.published
            },
            {
                title: 'Rolling updates and rollbacks',
                content: 'Zero-downtime deployments with kubectl.',
                status: PostStatus.published
            },
            {
                title: 'Securing a Kubernetes cluster',
                content: 'RBAC, network policies and pod security standards.',
                status: PostStatus.draft
            }
        ]
    },
    {
        name: 'CI/CD',
        description: 'Build, test and deployment pipelines',
        posts: [
            {
                title: 'Building a CI pipeline from scratch',
                content: 'Linting, testing and building on every push.',
                status: PostStatus.draft
            },
            {
                title: 'Caching dependencies in CI',
                content: 'Speeding up pipelines by reusing installed packages.',
                status: PostStatus.published
            },
            {
                title: 'Blue-green deployments',
                content: 'Cutting over traffic between two production environments.',
                status: PostStatus.scheduled
            },
            {
                title: 'Automating releases with semantic versioning',
                content: 'Tagging and changelog generation on merge.',
                status: PostStatus.published
            },
            {
                title: 'Testing pipelines in isolation',
                content: 'Running pipeline steps locally before pushing.',
                status: PostStatus.draft
            }
        ]
    },
    {
        name: 'Databases',
        description: 'Schema design, migrations and query performance',
        posts: [
            {
                title: 'Designing a normalized schema',
                content: 'Balancing normalization against query complexity.',
                status: PostStatus.published
            },
            {
                title: 'Writing safe migrations',
                content: 'Backward-compatible schema changes for zero downtime.',
                status: PostStatus.published
            },
            {
                title: 'Indexing strategies that matter',
                content: 'Composite indexes, covering indexes and when to skip them.',
                status: PostStatus.draft
            },
            {
                title: 'Connection pooling explained',
                content: 'Why pgbouncer exists and how it changes your app.',
                status: PostStatus.scheduled
            },
            {
                title: 'N+1 queries and how to avoid them',
                content: 'Batching and eager loading in an ORM.',
                status: PostStatus.draft
            }
        ]
    }
];

const unassignedPosts: ISeedPost[] = [
    {
        title: 'Unassigned scratch notes',
        content: 'A post with no topic, for testing nullable relations.',
        status: PostStatus.draft
    },
    {
        title: 'Random ideas dump',
        content: 'Miscellaneous notes not tied to any topic yet.',
        status: PostStatus.published
    }
];

async function main(): Promise<void> {
    await Database.post.deleteMany();
    await Database.topic.deleteMany();

    for (const {name, description, posts} of topics) {
        await Database.topic.create({data: {name, description, posts: {create: posts}}});
    }

    await Database.post.createMany({data: unassignedPosts});
}

main()
    .then(async () => {
        await Database.$disconnect();
    })
    .catch(async err => {
        console.error(err);
        await Database.$disconnect();
        process.exit(1);
    });
