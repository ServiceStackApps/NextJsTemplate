DEL ..\MyApp\Configure.Auth.cs
DEL ..\MyApp\Configure.AuthRepository.cs
DEL ..\MyApp\Configure.Db.cs

COPY auth\Configure.Auth.cs ..\MyApp\
COPY auth\Configure.AuthRepository.cs ..\MyApp\
COPY auth\Configure.Db.cs ..\MyApp\
