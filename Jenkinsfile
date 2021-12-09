/* groovylint-disable-next-line CompileStatic */
pipepline {
  agent any
  environment {
    
  }
  stages {
      stage('install npm packages') {
        steps {
          sh(script: 'yarn install --frozen-lockfile', returnStatus: true)
        }
      }
      stage('Test') {
        steps {
          sh(script: 'yarn test-cover')
        }
      }
    stage('Deploy to npm') {
        steps {
          sh 'npm publish --token'
        }
    }
  }
  post {
      always {
        archiveArtifacts(artifacts: 'junit.xml, coverage/')
        junit 'junit.xml'
      }
  }
}
