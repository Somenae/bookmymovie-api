pipeline {
    agent any

    stages {
        stage('clone repo') {
            git 'https://github.com/Somenae/bookmymovie-api'
        }
        stage('build') {
            steps {
                sh 'npm install'
            }
        }
    }
}