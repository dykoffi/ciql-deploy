/* groovylint-disable-next-line CompileStatic */
pipeline {
    agent any
    environment {
        NPM_TOKEN = credentials('npm_token')
    }

    stages {
        stage('send to npm') {
      steps {
          sh 'echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" >> ~/.npmrc'
          sh 'npm publish'
        }
      }
    }
}
