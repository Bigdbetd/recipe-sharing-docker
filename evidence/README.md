# Pipeline screenshots

- `recipe-ci-dashboard.jpg`: workflow dashboard, including the successful validation-only run and failed runs.
- `recipe-ci-failed-test.jpg`: intentional backend test failure; deployment was skipped. [Run #2](https://github.com/Bigdbetd/recipe-sharing-docker/actions/runs/42542845919)
- `recipe-ci-passing-steps.jpg`: every test/build step passed in the initial run. Its separate deployment job failed on missing GCP credentials. [Run #1](https://github.com/Bigdbetd/recipe-sharing-docker/actions/runs/42542815523)
- `recipe-ci-validation-only-success.jpg`: successful manual run with deployment explicitly unchecked. [Run #5](https://github.com/Bigdbetd/recipe-sharing-docker/actions/runs/42543034043)

**No screenshot here proves a complete automated Cloud Run deployment.** Add the required GCP secrets and capture a run where the deployment job also passes before submitting the finished assignment.
