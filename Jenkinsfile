/* groovylint-disable-next-line CompileStatic */
pipeline {
    agent any
    environment {
        NPM = credentials('npm_token')
    }

    stages {
        stage('Hello') {
            steps {
                echo 'Hello World'
                sh 'touch "$NPM" > text.md'
                archiveArtifacts artifacts: 'text.md', followSymlinks: false
            }
        }
    }
}
