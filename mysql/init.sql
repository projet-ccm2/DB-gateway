-- ===============================
-- init.sql: schema + sample data
-- ===============================

-- Tables
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

-- ===============================
-- Sample Data
-- ===============================

-- Users
INSERT INTO Users (User_ID, User_Username) VALUES
('11111111-1111-1111-1111-111111111111', 'alice'),
('22222222-2222-2222-2222-222222222222', 'bob'),
('33333333-3333-3333-3333-333333333333', 'charlie')
ON DUPLICATE KEY UPDATE User_Username=VALUES(User_Username);

-- Channels
INSERT INTO Chanels (Chanel_ID, Chanel_Name) VALUES
('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa','general'),
('bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb','gaming'),
('ccccccc3-cccc-cccc-cccc-cccccccccccc','coding')
ON DUPLICATE KEY UPDATE Chanel_Name=VALUES(Chanel_Name);

-- Achievement Types
INSERT INTO Type_Achievements (Type_ID, Type_Label, Type_Data) VALUES
('ttttttt1-tttt-tttt-tttt-tttttttttttt', 'Message Count', 'Send 100 messages'),
('ttttttt2-tttt-tttt-tttt-tttttttttttt', 'Channel Join', 'Join 3 channels'),
('ttttttt3-tttt-tttt-tttt-tttttttttttt', 'Daily Login', 'Log in 7 days in a row')
ON DUPLICATE KEY UPDATE Type_Label=VALUES(Type_Label);

-- Achievements
INSERT INTO Achievements VALUES
('achv0001-aaaa-bbbb-cccc-dddddddddddd', 'Chatterbox', 'Send 100 messages in general', 100, 50, 'message_count', TRUE, 10, 50, TRUE, FALSE, 'msg.png', 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'ttttttt1-tttt-tttt-tttt-tttttttttttt'),
('achv0002-aaaa-bbbb-cccc-dddddddddddd', 'Explorer', 'Join 3 different channels', 3, 100, 'join_3_channels', TRUE, 5, 20, TRUE, FALSE, 'explorer.png', 'bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'ttttttt2-tttt-tttt-tttt-tttttttttttt'),
('achv0003-aaaa-bbbb-cccc-dddddddddddd', 'Loyal User', 'Login 7 days in a row', 7, 150, 'daily_login', TRUE, 2, 10, TRUE, TRUE, 'loyal.png', 'ccccccc3-cccc-cccc-cccc-cccccccccccc', 'ttttttt3-tttt-tttt-tttt-tttttttttttt')
ON DUPLICATE KEY UPDATE Achievement_Title=VALUES(Achievement_Title);

-- Badges
INSERT INTO Badges (Badge_ID, Badge_Title, Badge_img, Chanel_ID) VALUES
('badge0001-aaaa-bbbb-cccc-dddddddddddd', 'General Hero', 'hero.png', 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('badge0002-aaaa-bbbb-cccc-dddddddddddd', 'Gamer Legend', 'gamer.png', 'bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
('badge0003-aaaa-bbbb-cccc-dddddddddddd', 'Code Wizard', 'code.png', 'ccccccc3-cccc-cccc-cccc-cccccccccccc')
ON DUPLICATE KEY UPDATE Badge_Title=VALUES(Badge_Title);

-- Relations
INSERT INTO _Are (User_ID, Chanel_ID, User_Type) VALUES
('11111111-1111-1111-1111-111111111111', 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'admin'),
('22222222-2222-2222-2222-222222222222', 'bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'member'),
('33333333-3333-3333-3333-333333333333', 'ccccccc3-cccc-cccc-cccc-cccccccccccc', 'moderator')
ON DUPLICATE KEY UPDATE User_Type=VALUES(User_Type);

INSERT INTO _Achieved VALUES
('achv0001-aaaa-bbbb-cccc-dddddddddddd', '11111111-1111-1111-1111-111111111111', 100, TRUE, TRUE, NOW()),
('achv0002-aaaa-bbbb-cccc-dddddddddddd', '22222222-2222-2222-2222-222222222222', 2, FALSE, FALSE, NOW()),
('achv0003-aaaa-bbbb-cccc-dddddddddddd', '33333333-3333-3333-3333-333333333333', 7, TRUE, TRUE, NOW())
ON DUPLICATE KEY UPDATE Count=VALUES(Count);

INSERT INTO _Possesses VALUES
('11111111-1111-1111-1111-111111111111', 'badge0001-aaaa-bbbb-cccc-dddddddddddd', NOW()),
('22222222-2222-2222-2222-222222222222', 'badge0002-aaaa-bbbb-cccc-dddddddddddd', NOW()),
('33333333-3333-3333-3333-333333333333', 'badge0003-aaaa-bbbb-cccc-dddddddddddd', NOW())
ON DUPLICATE KEY UPDATE Aquired_Date=VALUES(Aquired_Date);
