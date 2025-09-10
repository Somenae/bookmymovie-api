pipeline {
    agent any

    tools {
        nodejs 'NodeJS 24.7.0'
    }

    stages {
        stage('build') {
            steps {
                sh 'npm install'
                /* sh 'npm run start:dev' */
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
                    def npmHome = tool 'NodeJS 24.7.0'
                    withSonarQubeEnv('Bookmymovie') {
                        echo "====++++${npmHome}++++===="
                    }
                }
            }
        }
    }
}