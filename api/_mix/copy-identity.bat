DEL ..\MyApp\Configure.Auth.cs
DEL ..\MyApp\Configure.AuthRepository.cs
DEL ..\MyApp\Configure.DB.cs

COPY identity\Configure.Auth.cs ..\MyApp\
COPY identity\Configure.AuthRepository.cs ..\MyApp\
COPY identity\Configure.Db.cs ..\MyApp\
