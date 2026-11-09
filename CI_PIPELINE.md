# Unit 10: Automated testing and deployment

## Pipeline
Every push to main runs the backend API tests, frontend tests, frontend production build, and both Docker image builds. Only successful validation permits the dependent Cloud Run deployment job. Pull requests run validation without deploying. Manual workflow runs can optionally omit deployment.

The deployment job uses GitHub OIDC and Google Workload Identity Federation. It submits the existing backend and frontend Cloud Build YAML files in order, then verifies the backend health endpoint and frontend homepage with curl.

## Validation and evidence
- 9 backend API tests and 10 frontend tests passed.
- Backend tests use an isolated in-memory SQLite database and close their server/database connections.
- Frontend tests include the supplied utility tests plus two tests of the actual React component.
- Frontend production build and both Docker image builds passed.
- [Intentional failure, run #2](https://github.com/Bigdbetd/recipe-sharing-docker/actions/runs/42542845919): changed the expected POST response from 201 to 200. Backend tests failed and deployment was skipped.
- The intentional test change was restored in commit `4d9e4a8`.
- [Complete successful pipeline, run #7, attempt #5](https://github.com/Bigdbetd/recipe-sharing-docker/actions/runs/42552370180): tests, builds, both Cloud Run deployments, and endpoint verification passed.
- Screenshots are in `evidence/`. Earlier validation-only screenshots are clearly distinguished from the complete deployment.
- GitHub workflow email notifications were enabled for success and failure.

## Authentication and permissions
Project: `project-63de95f5-a7d6-4569-9a2`

Provider: `projects/1053892050255/locations/global/workloadIdentityPools/github-actions/providers/github`

GitHub impersonates:
`recipe-build-deployer@project-63de95f5-a7d6-4569-9a2.iam.gserviceaccount.com`

Provider mappings:
```text
google.subject = assertion.sub
attribute.repository = assertion.repository
```

Provider condition:
```text
assertion.repository == 'Bigdbetd/recipe-sharing-docker' && assertion.ref == 'refs/heads/main'
```

The pool grants Workload Identity User access to the deployment service account for that repository attribute. Only the deployment job receives `id-token: write`.

The submission identity uses Cloud Build Editor, Service Usage Consumer, and Storage Bucket Viewer at project scope, plus Storage Object User and Storage Legacy Bucket Reader on the source bucket. Its existing Cloud Run Admin, Artifact Registry Writer, and Logs Writer roles were also present.

Cloud Build executes as the default compute service account:
`1053892050255-compute@developer.gserviceaccount.com`

This execution identity has source-bucket Storage Object Viewer access, Artifact Registry Writer, Cloud Run Admin, and Logs Writer. Service Account User was granted on the specific runtime service account so the build can deploy using it. No downloaded JSON key or GCP Actions secret is required.

## Run locally
```bash
cd backend
npm ci
npm test -- --runInBand
cd ../frontend
npm ci
npm test -- --threads=false
npm run build
```

## Deployed URLs
- Backend health: https://recipe-backend-jdzyo544ya-uc.a.run.app/api/health
- Frontend: https://recipe-frontend-jdzyo544ya-uc.a.run.app

Both services use us-central1. Cloud Run's local SQLite database is not durable shared storage across revisions or instances; a managed database would be appropriate for production persistence.

## Turn in
1. Repository: https://github.com/Bigdbetd/recipe-sharing-docker
2. Screenshots in `evidence/`: dashboard, complete successful deployment, passing deployment steps, and intentional test failure.
3. `reflection.txt`: 361-word analysis.

## References
- https://docs.github.com/en/actions/concepts/runners/github-hosted-runners
- https://docs.github.com/en/actions/reference/limits
- https://docs.cloud.google.com/iam/docs/workload-identity-federation-with-deployment-pipelines
- https://www.jenkins.io/doc/book/pipeline/
- https://www.jenkins.io/doc/book/using/using-agents/
- https://www.jenkins.io/doc/book/using/best-practices/
