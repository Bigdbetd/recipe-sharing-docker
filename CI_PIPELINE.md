# Unit 10 CI/CD evidence and setup

## Implemented
- `.github/workflows/deploy.yml` runs backend tests, frontend tests, a Vite build, and both Docker builds.
- The deployment job depends on successful validation and runs only for main-branch pushes or explicitly requested main-branch deployments.
- Deployment uses the existing Cloud Build YAML files and the existing us-central1 Cloud Run services.
- Package lockfiles are committed for reproducible `npm ci` installs.
- Backend tests use an isolated SQLite in-memory database. The production SQLite implementation remains in place.
- The supplied API tests were integrated, with database initialization and cleanup added. Successful deletion now returns the supplied tests' expected HTTP 204.
- The supplied frontend utility tests were retained, and two real React component tests were added.
- The proper `frontend/vite.config.js` loads the test setup and jsdom environment.
- GitHub Actions notifications are configured for successful and failed workflows.

## Local validation
```bash
cd backend
npm install
npm test -- --runInBand
cd ../frontend
npm install
npm test -- --threads=false
npm run build
```
Results: 9 backend tests and 10 frontend tests passed; the production frontend build passed.
Both Docker images also built successfully in GitHub Actions.

## Recorded executions
1. [Initial validation](https://github.com/Bigdbetd/recipe-sharing-docker/actions/runs/42542815523): tests and both Docker image builds passed; deployment failed because GCP secrets were missing.
2. [Intentional failing test](https://github.com/Bigdbetd/recipe-sharing-docker/actions/runs/42542845919): changed POST's expected status from 201 to 200. Backend tests failed; later stages and deployment were skipped.
3. The incorrect expectation was restored in commit `4d9e4a8`.
4. [Manual validation-only run #5](https://github.com/Bigdbetd/recipe-sharing-docker/actions/runs/42543034043) succeeded with the deploy checkbox cleared. A validation-only success does not demonstrate a successful Cloud Run deployment.

## Deployment authentication
The workflow now uses GitHub OIDC with Google Workload Identity Federation. No JSON service account key or GCP Actions secret is required.

- Project: `project-63de95f5-a7d6-4569-9a2`
- Provider: `projects/1053892050255/locations/global/workloadIdentityPools/github-actions/providers/github`
- Service account: `recipe-build-deployer@project-63de95f5-a7d6-4569-9a2.iam.gserviceaccount.com`
- Repository attribute: `Bigdbetd/recipe-sharing-docker`
- Provider condition restricts authentication to that repository's main branch.
- Only the deployment job receives `id-token: write`; validation has read-only repository permissions.

[Run #6](https://github.com/Bigdbetd/recipe-sharing-docker/actions/runs/42551535205) verifies the new configuration. Its test/build job and authentication step passed; full deployment is still being verified.
Cloud Build source storage, build execution, runtime service-account access, and log-reading permissions must also permit the deployment.

Region is already us-central1 in the Cloud Build YAML; this workflow does not require a GCP_REGION secret.
Existing backend: https://recipe-backend-1053892050255.us-central1.run.app
Existing frontend: https://recipe-frontend-1053892050255.us-central1.run.app
Both endpoints responded successfully during setup. This does not prove a new automated deployment occurred.

Cloud Run's local SQLite data is not durable shared storage across revisions or instances. A managed database would be needed for durable production data.

## Deliverables
- This repository's link.
- The screenshots in `evidence/`, plus a complete successful deployment screenshot once GCP authentication is configured.
- `reflection.txt` (358 words; accurately distinguishes validated CI from pending CD).

## Reference documentation
- https://docs.github.com/en/actions/concepts/runners/github-hosted-runners
- https://docs.github.com/en/actions/reference/limits
- https://www.jenkins.io/doc/book/pipeline/
- https://www.jenkins.io/doc/book/using/using-agents/
- https://www.jenkins.io/doc/book/using/best-practices/
