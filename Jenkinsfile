/* groovylint-disable-next-line CompileStatic */
pipeline {
    agent any
    environment {
        NPM_TOKEN = credentials('npm_token')
    }

    stages {
        stage('send to npm') {
      steps {
          sh 'npm publish --access=public'
        }
      }
    }
}
