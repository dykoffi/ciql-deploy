/* groovylint-disable-next-line CompileStatic */
pipepline {
  agent any
  environment {
    NPM = credentials('npm_token')
  }
  stages {
      stage('Send to NPM') {
        steps {
          sh 'npm publish --token $NPM'
        }
      }
  }
}
