export const config = {
  "dev": {
    "username": "postgres",
    "password": "postgres",
    "database": "database_name",
    "host": "database-instance-id.cvblabgxnph4.ap-southeast-2.rds.amazonaws.com",
    "dialect": "postgres",
    "aws_region": "ap-southeast-2",
    "aws_profile": "udagram-wilkie-dev",
    "aws_media_bucket": "udagram-wilkie-dev"
  },
  "prod": {
    "username": "",
    "password": "",
    "database": "udagram_prod",
    "host": "",
    "dialect": "postgres"
  }
}
