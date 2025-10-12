-- init.sql: schema + test data

-- Tables
CREATE TABLE IF NOT EXISTS Users(
    User_ID       Varchar (36) NOT NULL,
    User_Username Varchar (50) NOT NULL,
    CONSTRAINT Users_PK PRIMARY KEY (User_ID)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Chanels(
    Chanel_ID   Char (36) NOT NULL,
    Chanel_Name Varchar (50) NOT NULL,
    CONSTRAINT Chanels_PK PRIMARY KEY (Chanel_ID)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Type_Achievements(
    Type_ID    Char (36) NOT NULL,
    Type_Label Varchar (50) NOT NULL,
    Type_Data  Varchar (55) NOT NULL,
    CONSTRAINT Type_Achievements_PK PRIMARY KEY (Type_ID)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Achievements(
    Achievement_ID          Char (36) NOT NULL,
    Achievement_Title       Varchar (50) NOT NULL,
    Achievement_Description Varchar (255) NOT NULL,
    Achievement_Goal        Int NOT NULL,
    Achievement_Reward      Int NOT NULL,
    Achievement_Label       Varchar (55) NOT NULL,
    Achievement_Public      Bool NOT NULL,
    Achievement_Downloads   Int NOT NULL,
    Achievement_Visits      Int NOT NULL,
    Achievement_Active      Bool NOT NULL,
    Achievement_Secret      Bool NOT NULL,
    Achievement_Image       Varchar (55) NOT NULL,
    Chanel_ID               Char (36),
    Type_ID                 Char (36),
    CONSTRAINT Achievements_PK PRIMARY KEY (Achievement_ID),
    CONSTRAINT Achievements_Chanels_FK FOREIGN KEY (Chanel_ID) REFERENCES Chanels(Chanel_ID),
    CONSTRAINT Achievements_Type_Achievements0_FK FOREIGN KEY (Type_ID) REFERENCES Type_Achievements(Type_ID)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Badges(
    Badge_ID    Varchar (36) NOT NULL,
    Badge_Title Varchar (50) NOT NULL,
    Badge_img   Varchar (50) NOT NULL,
    Chanel_ID   Char (36),
    CONSTRAINT Badges_PK PRIMARY KEY (Badge_ID),
    CONSTRAINT Badges_Chanels_FK FOREIGN KEY (Chanel_ID) REFERENCES Chanels(Chanel_ID)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS _Achieved(
    Achievement_ID Char (36) NOT NULL,
    User_ID        Varchar (36) NOT NULL,
    Count          Int NOT NULL,
    Finished       Bool NOT NULL,
    Label_Active   Bool NOT NULL,
    Aquired_Date   Datetime NOT NULL,
    CONSTRAINT _Achieved_PK PRIMARY KEY (Achievement_ID,User_ID),
    CONSTRAINT _Achieved_Achievements_FK FOREIGN KEY (Achievement_ID) REFERENCES Achievements(Achievement_ID),
    CONSTRAINT _Achieved_Users0_FK FOREIGN KEY (User_ID) REFERENCES Users(User_ID)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS _Are(
    User_ID   Varchar (36) NOT NULL,
    Chanel_ID Char (36) NOT NULL,
    User_Type Varchar (50) NOT NULL,
    CONSTRAINT _Are_PK PRIMARY KEY (User_ID,Chanel_ID),
    CONSTRAINT _Are_Users_FK FOREIGN KEY (User_ID) REFERENCES Users(User_ID),
    CONSTRAINT _Are_Chanels0_FK FOREIGN KEY (Chanel_ID) REFERENCES Chanels(Chanel_ID)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS _Possesses(
    User_ID      Varchar (36) NOT NULL,
    Badge_ID     Varchar (36) NOT NULL,
    Aquired_Date Datetime NOT NULL,
    CONSTRAINT _Possesses_PK PRIMARY KEY (User_ID,Badge_ID),
    CONSTRAINT _Possesses_Users_FK FOREIGN KEY (User_ID) REFERENCES Users(User_ID),
    CONSTRAINT _Possesses_Badges0_FK FOREIGN KEY (Badge_ID) REFERENCES Badges(Badge_ID)
) ENGINE=InnoDB;

-- Données de test (exemples)
INSERT INTO Users (User_ID, User_Username) VALUES ('11111111-1111-1111-1111-111111111111', 'alice')
ON DUPLICATE KEY UPDATE User_Username=VALUES(User_Username);

INSERT INTO Users (User_ID, User_Username) VALUES ('22222222-2222-2222-2222-222222222222', 'bob')
ON DUPLICATE KEY UPDATE User_Username=VALUES(User_Username);

INSERT INTO Chanels (Chanel_ID, Chanel_Name) VALUES ('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa','general')
ON DUPLICATE KEY UPDATE Chanel_Name=VALUES(Chanel_Name);
