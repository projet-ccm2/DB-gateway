-- ===============================
-- init_schema.sql: tables et contraintes
-- ===============================

CREATE TABLE IF NOT EXISTS Users(
    User_ID       VARCHAR(36) NOT NULL,
    User_Username VARCHAR(50) NOT NULL,
    CONSTRAINT Users_PK PRIMARY KEY (User_ID)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Chanels(
    Chanel_ID   CHAR(36) NOT NULL,
    Chanel_Name VARCHAR(50) NOT NULL,
    CONSTRAINT Chanels_PK PRIMARY KEY (Chanel_ID)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Type_Achievements(
    Type_ID    CHAR(36) NOT NULL,
    Type_Label VARCHAR(50) NOT NULL,
    Type_Data  VARCHAR(55) NOT NULL,
    CONSTRAINT Type_Achievements_PK PRIMARY KEY (Type_ID)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Achievements(
    Achievement_ID          CHAR(36) NOT NULL,
    Achievement_Title       VARCHAR(50) NOT NULL,
    Achievement_Description VARCHAR(255) NOT NULL,
    Achievement_Goal        INT NOT NULL,
    Achievement_Reward      INT NOT NULL,
    Achievement_Label       VARCHAR(55) NOT NULL,
    Achievement_Public      BOOL NOT NULL,
    Achievement_Downloads   INT NOT NULL,
    Achievement_Visits      INT NOT NULL,
    Achievement_Active      BOOL NOT NULL,
    Achievement_Secret      BOOL NOT NULL,
    Achievement_Image       VARCHAR(55) NOT NULL,
    Chanel_ID               CHAR(36),
    Type_ID                 CHAR(36),
    CONSTRAINT Achievements_PK PRIMARY KEY (Achievement_ID),
    CONSTRAINT Achievements_Chanels_FK FOREIGN KEY (Chanel_ID) REFERENCES Chanels(Chanel_ID),
    CONSTRAINT Achievements_Type_Achievements0_FK FOREIGN KEY (Type_ID) REFERENCES Type_Achievements(Type_ID)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Badges(
    Badge_ID    VARCHAR(36) NOT NULL,
    Badge_Title VARCHAR(50) NOT NULL,
    Badge_img   VARCHAR(50) NOT NULL,
    Chanel_ID   CHAR(36),
    CONSTRAINT Badges_PK PRIMARY KEY (Badge_ID),
    CONSTRAINT Badges_Chanels_FK FOREIGN KEY (Chanel_ID) REFERENCES Chanels(Chanel_ID)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS _Achieved(
    Achievement_ID CHAR(36) NOT NULL,
    User_ID        VARCHAR(36) NOT NULL,
    Count          INT NOT NULL,
    Finished       BOOL NOT NULL,
    Label_Active   BOOL NOT NULL,
    Aquired_Date   DATETIME NOT NULL,
    CONSTRAINT _Achieved_PK PRIMARY KEY (Achievement_ID,User_ID),
    CONSTRAINT _Achieved_Achievements_FK FOREIGN KEY (Achievement_ID) REFERENCES Achievements(Achievement_ID),
    CONSTRAINT _Achieved_Users0_FK FOREIGN KEY (User_ID) REFERENCES Users(User_ID)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS _Are(
    User_ID   VARCHAR(36) NOT NULL,
    Chanel_ID CHAR(36) NOT NULL,
    User_Type VARCHAR(50) NOT NULL,
    CONSTRAINT _Are_PK PRIMARY KEY (User_ID,Chanel_ID),
    CONSTRAINT _Are_Users_FK FOREIGN KEY (User_ID) REFERENCES Users(User_ID),
    CONSTRAINT _Are_Chanels0_FK FOREIGN KEY (Chanel_ID) REFERENCES Chanels(Chanel_ID)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS _Possesses(
    User_ID      VARCHAR(36) NOT NULL,
    Badge_ID     VARCHAR(36) NOT NULL,
    Aquired_Date DATETIME NOT NULL,
    CONSTRAINT _Possesses_PK PRIMARY KEY (User_ID,Badge_ID),
    CONSTRAINT _Possesses_Users_FK FOREIGN KEY (User_ID) REFERENCES Users(User_ID),
    CONSTRAINT _Possesses_Badges0_FK FOREIGN KEY (Badge_ID) REFERENCES Badges(Badge_ID)
) ENGINE=InnoDB;
