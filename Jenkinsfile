pipeline {
    agent any

    stages {
        stage('clone repo') {
            steps {
                git 'https://github.com/Somenae/bookmymovie-api'
            }
        }
        stage('build') {
            steps {
                sh 'npm install'
            }
        }
    }
}