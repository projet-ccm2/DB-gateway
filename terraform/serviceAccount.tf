module "service_account_authentication" {
  source       = "./modules/service_account"
  account_id   = "db-gateway-service"
  display_name = "db Service Account"
  project_id   = "streamquest-472309"
  roles        = [
    "roles/cloudsql.client",
    "roles/storage.objectViewer",
    "roles/secretmanager.secretAccessor",
    "roles/artifactregistry.reader"
  ]
}