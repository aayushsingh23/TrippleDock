pipeline {
    agent any

    environment {
        DOCKER_NETWORK = "my_custom_network"
        DATABASE_IMAGE = "database_image"
        BACKEND_IMAGE = "backend_image"
        FRONTEND_IMAGE = "frontend_image"
        DATABASE_CONTAINER = "database"
        BACKEND_CONTAINER = "backend"
        FRONTEND_CONTAINER = "frontend"
    }

    stages {
        stage('Build Docker Images') {
            steps {
                script {
                    docker.build("${DATABASE_IMAGE}", "-f Dockerfile.database .")
                    docker.build("${BACKEND_IMAGE}", "-f Dockerfile.backend .")
                    docker.build("${FRONTEND_IMAGE}", "-f Dockerfile.frontend .")
                }
            }
        }

        stage('Create Docker Network') {
            steps {
                sh """
                docker network create ${DOCKER_NETWORK} || true
                """
            }
        }

        stage('Run Containers') {
            steps {
                script {
                    // Run database container
                    sh """
                    docker run -d --name ${DATABASE_CONTAINER} --network ${DOCKER_NETWORK} ${DATABASE_IMAGE}
                    """
                    
                    // Run backend container
                    sh """
                    docker run -d --name ${BACKEND_CONTAINER} --network ${DOCKER_NETWORK} ${BACKEND_IMAGE}
                    """

                    // Run frontend container
                    sh """
                    docker run -d --name ${FRONTEND_CONTAINER} --network ${DOCKER_NETWORK} -p 8080:80 ${FRONTEND_IMAGE}
                    """
                }
            }
        }

        stage('Configure Firewall Rules') {
            steps {
                script {
                    // Block database outgoing connections
                    sh """
                    docker exec ${DATABASE_CONTAINER} sh -c "apk add iptables && iptables -A OUTPUT -j DROP"
                    """

                    // Allow backend to access database and block other outgoing connections
                    def database_ip = sh(script: "docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' ${DATABASE_CONTAINER}", returnStdout: true).trim()
                    sh """
                    docker exec ${BACKEND_CONTAINER} sh -c "apk add iptables && iptables -A OUTPUT ! -d ${database_ip} -j DROP"
                    """

                    // Allow frontend to access backend and database and block other outgoing connections
                    def backend_ip = sh(script: "docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' ${BACKEND_CONTAINER}", returnStdout: true).trim()
                    sh """
                    docker exec ${FRONTEND_CONTAINER} sh -c "apk add iptables && iptables -A OUTPUT ! -d ${backend_ip} -j DROP && iptables -A OUTPUT ! -d ${database_ip} -j DROP"
                    """
                }
            }
        }
    }

    post {
        always {
            // Clean up Docker containers
            sh """
            docker rm -f ${DATABASE_CONTAINER} || true
            docker rm -f ${BACKEND_CONTAINER} || true
            docker rm -f ${FRONTEND_CONTAINER} || true
            docker network rm ${DOCKER_NETWORK} || true
            """
        }
    }
}
