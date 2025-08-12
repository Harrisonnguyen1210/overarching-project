CREATE TABLE "app_user" (
    "id" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "emailVerified" BOOLEAN NOT NULL,
    "image" VARCHAR(255),
    "createdAt" TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE "session" (
    "id" VARCHAR(255) NOT NULL,
    "userId" VARCHAR(255) NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "expiresAt" TIMESTAMP NOT NULL,
    "ipAddress" VARCHAR(255),
    "userAgent" VARCHAR(255),
    "createdAt" TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("userId") REFERENCES "app_user"("id")
);

CREATE TABLE "account" (
    "id" VARCHAR(255) NOT NULL,
    "userId" VARCHAR(255) NOT NULL,
    "accountId" VARCHAR(255) NOT NULL,
    "providerId" VARCHAR(255) NOT NULL,
    "accessToken" VARCHAR(255),
    "refreshToken" VARCHAR(255),
    "accessTokenExpiresAt" TIMESTAMP,
    "refreshTokenExpiresAt" TIMESTAMP,
    "scope" VARCHAR(255),
    "idToken" VARCHAR(255),
    "password" VARCHAR(255),
    "createdAt" TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("userId") REFERENCES "app_user"("id")
);

CREATE TABLE "verification" (
    "id" VARCHAR(255) NOT NULL,
    "identifier" VARCHAR(255) NOT NULL,
    "value" VARCHAR(255) NOT NULL,
    "expiresAt" TIMESTAMP NOT NULL,
    "createdAt" TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL,
    PRIMARY KEY ("id")
);