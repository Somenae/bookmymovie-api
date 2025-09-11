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
                    waitForQualityGate abortPipeline: false
                }
            }
        }

        stage('Vulnerability check') {
            steps {
                sh 'npm audit'
            }
        }

        stage("Scanning docker image") {
            steps{
                script {
                    def trivyStatus = sh(
                        script: "sudo docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image --exit-code 1 --severity CRITICAL bookmymovie-api:latest",
                        returnStatus: true
                    )
                    if (trivyStatus != 0) {
                        error "Échec du pipeline à cause de vulnérabilités critiques détectées par Trivy."
                    } else {
                        echo "Aucun problème critique détecté par Trivy."
                    }
                }
            }
        }
    }
}