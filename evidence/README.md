# Assignment screenshots

## Submit these
- [Workflow dashboard](recipe-final-workflow-dashboard.jpg)
- [Complete successful pipeline: tests and deployment](recipe-complete-pipeline-success.jpg)
- [All deployment steps passing](recipe-successful-deployment-steps.jpg)
- [Intentional test failure with deployment skipped](recipe-ci-failed-test.jpg)

[Successful run #7, attempt #5](https://github.com/Bigdbetd/recipe-sharing-docker/actions/runs/42552370180): backend tests, frontend tests, Docker builds, both Cloud Run deployments, and endpoint checks passed.

[Intentional failure run #2](https://github.com/Bigdbetd/recipe-sharing-docker/actions/runs/42542845919): the incorrect expected POST status caused the backend test to fail; build/deployment stages were skipped. The test was subsequently restored.

## Earlier setup evidence
- `recipe-ci-dashboard.jpg`: dashboard before full deployment was configured.
- `recipe-ci-passing-steps.jpg`: initial tests and Docker builds passed, but the separate deployment job lacked authentication configuration.
- `recipe-ci-validation-only-success.jpg`: manual validation-only run; deployment was explicitly skipped.

The earlier setup images are retained for history. Use the complete successful pipeline screenshot above to demonstrate deployment.
