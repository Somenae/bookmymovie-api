pipeline {
    agent any

    tools {
        nodejs 'NodeJS 24.7.0'
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

        stage('Scan Docker image') {
            echo "====++++Pouet++++===="
        }
    }
}