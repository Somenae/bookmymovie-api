pipeline {
    agent any

    tools {
        nodejs 'NodeJS 24.7.0'
        dockerTool 'Docker-pipeline'
    }

    stages {
        stage('build') {
            steps {
                sh 'npm install'
            }
        }

        stage('Tests') {
            steps {
                sh 'npm test'
                junit 'junit.xml'
            }
        }

        stage('SonarQube analysis') {
            steps {
                script {
                    withSonarQubeEnv('Bookmymovie') {
                        sh 'npm run sonarQube'
                    }
                }
            }
        }

        stage('Quality gate') {
            steps {
                timeout(time: 1, unit: 'HOURS') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Vulnerability check') {
            steps {
                sh 'npm audit'
            }
        }

        stage('Initialize' ){
            steps {
                script {
                    sh "sudo docker run aquasec/trivy:latest"
                }
            }
        }

        /* stage('Scan Docker image') {
            steps {
                sh 'docker -v'
                sh 'docker pull aquasec/trivy:latest'
            }
        } */
    }
}