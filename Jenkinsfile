pipeline {
    agent any
    tools 'NodeJS 24.7.0'

    stages {
        /* stage('clone repo') {
            steps {
                git 'https://github.com/Somenae/bookmymovie-api'
            }
        } */
        stage('build') {
            steps {
                sh 'npm install'
            }
        }
    }
}