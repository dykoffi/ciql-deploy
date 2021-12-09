/* groovylint-disable-next-line CompileStatic */
pipeline {
    agent any
    environment {
        NPM = credentials('npm_token')
    }

    stages {
        stage('send to npm') {
      steps {
        sh 'npm ci publish --token $NPM'
      }
        }
    }
}
