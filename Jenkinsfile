/* groovylint-disable-next-line CompileStatic */
pipeline {
    agent any
    environment {
        NPM_TOKEN = credentials('npm_token')
    }

    stages {
        stage('publish to npm') {
      steps {
          sh 'npm publish --token $NPM_TOKEN'
        }
      }
    }
}
