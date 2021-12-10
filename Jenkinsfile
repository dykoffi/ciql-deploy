/* groovylint-disable-next-line CompileStatic */
pipeline {
    agent any
    environment {
        NPM = credentials('81cdc46c-3d6a-4346-90df-02f2d86cefa5')
    }

    stages {
        stage('send to npm') {
      steps {
          sh 'npm publish --token $NPM'
        }
      }
    }
}
