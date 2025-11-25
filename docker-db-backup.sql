--
-- PostgreSQL database dump
--

\restrict mcUwkrPyre1syxmJ8p8BtgcEEyjy81W5gWqCYJXh0kcBeKsODZMJj2a2sabMgrH

-- Dumped from database version 15.15 (Debian 15.15-1.pgdg13+1)
-- Dumped by pg_dump version 15.15 (Debian 15.15-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: FileType; Type: TYPE; Schema: public; Owner: edu_user
--

CREATE TYPE public."FileType" AS ENUM (
    'VIDEO',
    'PDF'
);


ALTER TYPE public."FileType" OWNER TO edu_user;

--
-- Name: MCQOption; Type: TYPE; Schema: public; Owner: edu_user
--

CREATE TYPE public."MCQOption" AS ENUM (
    'A',
    'B',
    'C',
    'D'
);


ALTER TYPE public."MCQOption" OWNER TO edu_user;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: edu_user
--

CREATE TYPE public."Role" AS ENUM (
    'USER',
    'ADMIN'
);


ALTER TYPE public."Role" OWNER TO edu_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Announcement; Type: TABLE; Schema: public; Owner: edu_user
--

CREATE TABLE public."Announcement" (
    id text NOT NULL,
    content text NOT NULL,
    active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdBy" text,
    "mediaUrl" text
);


ALTER TABLE public."Announcement" OWNER TO edu_user;

--
-- Name: Bookmark; Type: TABLE; Schema: public; Owner: edu_user
--

CREATE TABLE public."Bookmark" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "fileId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Bookmark" OWNER TO edu_user;

--
-- Name: File; Type: TABLE; Schema: public; Owner: edu_user
--

CREATE TABLE public."File" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "fileType" public."FileType" NOT NULL,
    "googleDriveUrl" text NOT NULL,
    "folderId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "ownerId" text,
    "order" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."File" OWNER TO edu_user;

--
-- Name: FileProgress; Type: TABLE; Schema: public; Owner: edu_user
--

CREATE TABLE public."FileProgress" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "fileId" text NOT NULL,
    completed boolean DEFAULT false NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "lastOpenedAt" timestamp(3) without time zone
);


ALTER TABLE public."FileProgress" OWNER TO edu_user;

--
-- Name: Folder; Type: TABLE; Schema: public; Owner: edu_user
--

CREATE TABLE public."Folder" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "parentId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "createdById" text,
    "order" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."Folder" OWNER TO edu_user;

--
-- Name: MCQQuestion; Type: TABLE; Schema: public; Owner: edu_user
--

CREATE TABLE public."MCQQuestion" (
    id text NOT NULL,
    question text NOT NULL,
    "optionA" text NOT NULL,
    "optionB" text NOT NULL,
    "optionC" text NOT NULL,
    "optionD" text NOT NULL,
    "correctOption" public."MCQOption" NOT NULL,
    explanation text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."MCQQuestion" OWNER TO edu_user;

--
-- Name: MediaAsset; Type: TABLE; Schema: public; Owner: edu_user
--

CREATE TABLE public."MediaAsset" (
    id text NOT NULL,
    url text NOT NULL,
    label text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdBy" text
);


ALTER TABLE public."MediaAsset" OWNER TO edu_user;

--
-- Name: PasswordResetToken; Type: TABLE; Schema: public; Owner: edu_user
--

CREATE TABLE public."PasswordResetToken" (
    id text NOT NULL,
    "tokenHash" text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    used boolean DEFAULT false NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."PasswordResetToken" OWNER TO edu_user;

--
-- Name: SyllabusSection; Type: TABLE; Schema: public; Owner: edu_user
--

CREATE TABLE public."SyllabusSection" (
    id text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "parentId" text,
    "folderId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."SyllabusSection" OWNER TO edu_user;

--
-- Name: User; Type: TABLE; Schema: public; Owner: edu_user
--

CREATE TABLE public."User" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    "passwordHash" text NOT NULL,
    role public."Role" DEFAULT 'USER'::public."Role" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "isApproved" boolean DEFAULT false NOT NULL,
    "avatarUrl" text,
    phone text,
    "preparingFor" text,
    school text
);


ALTER TABLE public."User" OWNER TO edu_user;

--
-- Data for Name: Announcement; Type: TABLE DATA; Schema: public; Owner: edu_user
--

COPY public."Announcement" (id, content, active, "createdAt", "createdBy", "mediaUrl") FROM stdin;
504cb813-84fe-4738-84de-0303bedd91b7	HLO USERS TODAY IS HOLIDAY	t	2025-11-24 15:41:41.886	b9b470c2-5a88-4441-b692-4bd88be07462	\N
3b840a25-46e5-4af9-bd6d-f942d3bbed69	Hi	t	2025-11-24 17:52:43.461	b9b470c2-5a88-4441-b692-4bd88be07462	\N
ba514561-128c-4f23-aa7e-d3900efd1524	hlo users	t	2025-11-25 10:30:31.088	61ce3c1b-57ca-44cb-993e-0731b41eeaff	\N
\.


--
-- Data for Name: Bookmark; Type: TABLE DATA; Schema: public; Owner: edu_user
--

COPY public."Bookmark" (id, "userId", "fileId", "createdAt") FROM stdin;
51f5d4ec-138b-4698-9259-df3c04d858db	bf28bad8-7623-47d8-a05c-557ff8934212	854d80df-f633-4fe1-8040-5f6f7072ebf0	2025-11-24 17:51:14.279
b1786231-3d0c-4974-ba85-ae14a89aad76	bf28bad8-7623-47d8-a05c-557ff8934212	4e8aa96e-3d1f-48e9-8d08-8ff56779ef7e	2025-11-25 10:29:25.748
\.


--
-- Data for Name: File; Type: TABLE DATA; Schema: public; Owner: edu_user
--

COPY public."File" (id, name, description, "fileType", "googleDriveUrl", "folderId", "createdAt", "updatedAt", "ownerId", "order") FROM stdin;
25b80f31-a761-4cb6-8396-f3636b28b7fd	uno and saarc _watermark.pdf	\N	PDF	https://drive.google.com/file/d/1rs8olcL-XUwN_eDnkt9zC_HLSMNghQfL/view	9ef9c9dc-0bc5-4b1e-8610-8b1226238872	2025-11-24 15:20:34.13	2025-11-24 15:20:34.13	\N	0
1c2e2b96-2c0a-4e30-adae-41afc7b995b4	जात जाती_watermark.pdf	\N	PDF	https://drive.google.com/file/d/17hUx9sKKrL52uWboWX5zj53aW8zAmFI9/view	9ef9c9dc-0bc5-4b1e-8610-8b1226238872	2025-11-24 15:20:34.132	2025-11-24 15:20:34.132	\N	0
0f550ae0-af2a-4c7b-bc1a-e950cd55870a	नेपालको भूगोल.pdf	\N	PDF	https://drive.google.com/file/d/1lPfs3SuPALenilFee9hbLUavzZniohFU/view	9ef9c9dc-0bc5-4b1e-8610-8b1226238872	2025-11-24 15:20:34.133	2025-11-24 15:20:34.133	\N	0
9f4e8a42-d253-4c1b-9757-d629a4fd842f	विश्वको भूगोल_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1MD-wunjNNinrgH6DDqdmyRv2klWzDtvh/view	9ef9c9dc-0bc5-4b1e-8610-8b1226238872	2025-11-24 15:20:34.135	2025-11-24 15:20:34.135	\N	0
9b111413-c16c-43f7-bac3-2a5308ec0632	IQ.pdf	\N	PDF	https://drive.google.com/file/d/1LoLxtoTFaypCKrJ-XLGB36X7dRv8svTx/view	1778170d-5d75-4288-b406-eb6e4bc9a746	2025-11-24 15:20:34.138	2025-11-24 15:20:34.138	\N	0
1bb15b9d-d02c-4223-bd26-13695f43f49b	day 1 mansir 5.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1IVxhCj0hqNMO4l-PEn2MwlG7fRLHUQSb/view	2a678b73-6f70-4577-9205-c24491cdbecf	2025-11-24 15:20:34.326	2025-11-25 10:09:04.39	\N	1
e7bd4f8a-74da-44ff-bd2c-72f8900c9492	day 2 mansir 6.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1lqlNw72P8xs1olLfqz5JBBfoLWeEavCz/view	2a678b73-6f70-4577-9205-c24491cdbecf	2025-11-24 15:20:34.327	2025-11-25 10:09:04.39	\N	2
7e9a034a-edee-4874-9222-a5f385decea8	day 3 mansir 9.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1Koolw0FYl_3InisCvVzbBc-LStOGpxwP/view	2a678b73-6f70-4577-9205-c24491cdbecf	2025-11-24 15:20:34.328	2025-11-25 10:09:04.39	\N	3
7f6330c3-dc84-4fc3-9676-307092e1380a	Day 4 mansir 10.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1wihW_B62E6iu-VupzjIY_7kdpVblAVii/view	2a678b73-6f70-4577-9205-c24491cdbecf	2025-11-24 15:20:34.322	2025-11-25 10:09:04.39	\N	4
e9725789-69f9-49a2-989d-dec4c521a6f2	day 5 mansir 11.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1rE5XEL7JTqM9NT2SlvvglGFit-PjLhR_/view	2a678b73-6f70-4577-9205-c24491cdbecf	2025-11-24 15:20:34.328	2025-11-25 10:09:04.39	\N	5
fa78568c-146b-4477-be27-88486c64dddc	Day 6 mansir 12.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/146bjWS4D5qPEyyJRK4cl6TJpaskQRufo/view	2a678b73-6f70-4577-9205-c24491cdbecf	2025-11-24 15:20:34.323	2025-11-25 10:09:04.39	\N	6
348819f8-4e84-48c8-b961-3d656a8e5290	day 7 mansir 13.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1nb3A3QJq91jsyKJVRxk2msnkP6A-r53t/view	2a678b73-6f70-4577-9205-c24491cdbecf	2025-11-24 15:20:34.329	2025-11-25 10:09:04.39	\N	7
83a73524-8e45-4bc3-95ec-0d4b7ceb8d98	Day 8 mansir 14.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/114Ip2S6PhmyS8XASDkGqAGbQbDU8LlSN/view	2a678b73-6f70-4577-9205-c24491cdbecf	2025-11-24 15:20:34.324	2025-11-25 10:09:04.39	\N	8
09e85139-c950-4317-b1ee-aefd4057cd95	Day 9 mansir 15.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1ccgPqH85flfoYhTkmehA99d0kQ8nVCe6/view	2a678b73-6f70-4577-9205-c24491cdbecf	2025-11-24 15:20:34.325	2025-11-25 10:09:04.39	\N	9
75d108ad-c7ad-400b-baa2-f20989ba2230	Day 6 baishak 12.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/11-yuC1FA4-xER5zhJlKDQCdZuGlqCFMr/view	63505dc8-883d-4714-844a-20cb0022ef37	2025-11-24 15:14:39.017	2025-11-24 15:20:34.455	b9b470c2-5a88-4441-b692-4bd88be07462	0
b4931ea6-cae0-409d-a627-7d2801e9f049	1. Orientation.pdf	\N	PDF	https://drive.google.com/file/d/1lNl7AcAZebjCKaDCl-C-Km3UVX7xyF1S/view	94af0919-344e-4030-b375-0315c5cd4d9f	2025-11-24 15:20:34.141	2025-11-25 10:04:58.884	\N	0
93dca73e-96fc-416a-aaca-bc6ea889d854	1. Good Governance Act 2064.pdf	\N	PDF	https://drive.google.com/file/d/1XYzraEHcc32B2zH6uFmDzYSk7BnGrW5R/view	94af0919-344e-4030-b375-0315c5cd4d9f	2025-11-24 15:20:34.14	2025-11-25 10:04:58.884	\N	1
93c2bae0-f03d-427f-95ce-ff6c80e7c8fd	2. Electricity-Regulatory-Commission-Act-2074.pdf	\N	PDF	https://drive.google.com/file/d/1ahaFCVjS9B4mejptvgX68BRPx3hcEcnm/view	94af0919-344e-4030-b375-0315c5cd4d9f	2025-11-24 15:20:34.142	2025-11-25 10:04:58.884	\N	2
1e7f51dd-94af-41ba-add6-549c76b29482	Chapter 4. Concept of Management (2)_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1w3w4HIWfXxeOoQyUpkeBbCZrx6uEKqx_/view	6b79750e-45d4-49c2-8a0a-22759655be40	2025-11-24 15:20:34.174	2025-11-25 10:05:48.242	\N	1
8a4abd3d-59d1-40c8-8158-9a10ca2544f7	orientation class.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1cx8Ko7_cyhm7AV7Y4Xp6D9lRzMRs1eKO/view	2a678b73-6f70-4577-9205-c24491cdbecf	2025-11-24 15:20:34.33	2025-11-25 10:09:04.39	\N	0
f2d63929-8250-4184-aa37-789e4f5e22cc	Day 2 magh 9.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/16rYbwHjdWltAQS-2A7cCKg-K0lnnOZ1y/view	4d08317e-614a-4e8e-a180-b68d722cb809	2025-11-24 15:20:34.274	2025-11-25 10:07:14.83	\N	1
53387f4a-9ac5-4425-9ec6-875473aacf8c	NEA Electrical level 7 Old Question  (1).pdf	\N	PDF	https://drive.google.com/file/d/1sNe46hhwZSIg0El8H5QhAX5-XUzwv5tK/view	1e4526bd-28ab-4e50-b7d4-f61672769619	2025-11-24 15:20:34.195	2025-11-24 15:20:34.195	\N	0
35aadbef-e90c-41f6-9fef-23f62aa4bf5e	Day 10 magh 20.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/12doGEZGWMQob88XV4OqlEhiCamkK6hZv/view	4d08317e-614a-4e8e-a180-b68d722cb809	2025-11-24 15:20:34.236	2025-11-25 10:07:14.83	\N	9
044f00cb-ad9a-489a-ad0a-19ce279313cf	Day 11 magh 22.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1O1yoSwHvGVcxdRnpgQYIIguxqwHWrpAS/view	4d08317e-614a-4e8e-a180-b68d722cb809	2025-11-24 15:20:34.249	2025-11-25 10:07:14.83	\N	10
94b0ac74-16aa-413b-8b02-8e8f31c6f65c	Day 12 magh 23.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1mvosKpq0xmyiaV0U49x69OidLXxvEeyn/view	4d08317e-614a-4e8e-a180-b68d722cb809	2025-11-24 15:20:34.26	2025-11-25 10:07:14.83	\N	11
84a4b4a8-d31d-428b-a93f-ceed10bd1490	Day 13 magh 24.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1A21aipLV8l8e1xJ80EGadIsVzzEW4XT6/view	4d08317e-614a-4e8e-a180-b68d722cb809	2025-11-24 15:20:34.267	2025-11-25 10:07:14.83	\N	12
44f85591-73af-4117-a817-23f59dbfd52f	कर्मचारी सेवा  NEA marked.pdf	\N	PDF	https://drive.google.com/file/d/1lWd5yVHWiyvIt-8ZG12bXIaDkDs_KCdw/view	94af0919-344e-4030-b375-0315c5cd4d9f	2025-11-24 15:20:34.19	2025-11-25 10:04:58.884	\N	22
e9019aba-75f3-4d07-abf3-c0f5c6006d0e	नीति_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1DPxxzel5KdaBK0dYNikqD8QY1xMgRkVc/view	94af0919-344e-4030-b375-0315c5cd4d9f	2025-11-24 15:20:34.191	2025-11-25 10:04:58.884	\N	23
fe156de4-c36a-41d4-bb75-f0b29cd258c4	नेपालको संविधान_watermark.pdf	\N	PDF	https://drive.google.com/file/d/18TvA4N-cAybCafX6-2BQoDhwR2eCP2A5/view	94af0919-344e-4030-b375-0315c5cd4d9f	2025-11-24 15:20:34.192	2025-11-25 10:04:58.884	\N	24
e0552062-06fc-404d-8667-4ebecc0319eb	नेपाल-विद्युत-प्राधिकरण-ऐन-२०४१ marked_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1M-pw8fVgiZhXGCase9JShbZHWFrMyDeI/view	94af0919-344e-4030-b375-0315c5cd4d9f	2025-11-24 15:20:34.191	2025-11-25 10:04:58.884	\N	25
700b4362-22f7-482d-850e-299329df114f	विद्युत-ऐन-२०४९_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1XtURfAFyY6mX457WmrlsE3PSAZZJzoiD/view	94af0919-344e-4030-b375-0315c5cd4d9f	2025-11-24 15:20:34.193	2025-11-25 10:04:58.884	\N	26
9563cc03-4089-4f05-beb2-b497d073cd93	सार्वजनिक खरिद व्यवस्थापनका समस्याहरु_watermark.pdf	\N	PDF	https://drive.google.com/file/d/19Jr6OGZBeFXs_101y8l-656sot_Rok9Y/view	94af0919-344e-4030-b375-0315c5cd4d9f	2025-11-24 15:20:34.194	2025-11-25 10:04:58.884	\N	27
afaec0b4-e9af-417b-a68e-d31c539ddd1e	Day 14 magh 25.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1S-QQLWPCQsjc6xIz3_6zs6Yd_4OZr4Tf/view	4d08317e-614a-4e8e-a180-b68d722cb809	2025-11-24 15:20:34.269	2025-11-25 10:07:14.83	\N	13
10a24a6d-c679-429b-bf80-dd4eb1bbaa6f	Day 15 magh 27.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1FjY3J17Vt2zqRARUFh6JgMqXnMD-OB3I/view	4d08317e-614a-4e8e-a180-b68d722cb809	2025-11-24 15:20:34.27	2025-11-25 10:07:14.83	\N	14
0aaa2aad-9622-4cc1-838d-957394cd19bb	Day 17 magh 29.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/14xutgFMxFg9BR4Eo84D_mbR4MresxtQ6/view	4d08317e-614a-4e8e-a180-b68d722cb809	2025-11-24 15:20:34.271	2025-11-25 10:07:14.83	\N	16
0ad73ade-188b-4ae8-8585-8c088b55b348	Day 18 magh 30.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1nYzZo0NcT31wJsBQrz9KTzu4KL4eCSlF/view	4d08317e-614a-4e8e-a180-b68d722cb809	2025-11-24 15:20:34.272	2025-11-25 10:07:14.83	\N	17
d8cab043-f216-489c-88ed-a6c0842040e0	Day 19 falgun 1.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1uFqEHzCt74jPGlOzyPfahNCNMPUNHF1h/view	4d08317e-614a-4e8e-a180-b68d722cb809	2025-11-24 15:20:34.273	2025-11-25 10:07:14.83	\N	18
4e8aa96e-3d1f-48e9-8d08-8ff56779ef7e	Day 1 magh 8 .mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1p6kSHCvoTD9eYpiPoIiYnGULoMrFPvws/view	4d08317e-614a-4e8e-a180-b68d722cb809	2025-11-24 15:20:34.217	2025-11-25 10:07:14.83	\N	0
2b59c32c-0c15-46d5-b224-a6f8d1e647bb	Day 1  chaitra 19.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1a7lajJut_0vQY_Yf1wmGvtdwmwKW0F2M/view	2d11121c-1cd5-4ca5-a0c9-738825de8cfa	2025-11-24 15:20:34.409	2025-11-25 10:12:19.164	\N	0
d9772d64-a1e0-4216-9f71-bc0bc69f6f72	Day 2 chaitra 20.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1e-oMFEPqfwe1gTgKan4_ojme57OwQw2v/view	2d11121c-1cd5-4ca5-a0c9-738825de8cfa	2025-11-24 15:20:34.411	2025-11-25 10:12:19.164	\N	1
339ad256-dc02-4107-8442-91a0fc9d0f5a	Day 3 chaitra 21.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1F_BoySxK37PGjzgf8hlpqqDjL12ajvGv/view	2d11121c-1cd5-4ca5-a0c9-738825de8cfa	2025-11-24 15:20:34.412	2025-11-25 10:12:19.164	\N	2
b53c1e1c-08fa-496f-b254-2ab7ae9001f0	Day 4 chaitra 24.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1w0PVh1cnA8rsykFBL3SAvHqwULmJlPQM/view	2d11121c-1cd5-4ca5-a0c9-738825de8cfa	2025-11-24 15:20:34.413	2025-11-25 10:12:19.164	\N	3
dd902053-afff-422f-ad4b-dfb931e6d81d	Day 5 chaitra 25.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1ObqaSWMP5CGtphdlhD5Lu93C3AUot3To/view	2d11121c-1cd5-4ca5-a0c9-738825de8cfa	2025-11-24 15:20:34.413	2025-11-25 10:12:19.164	\N	4
a16b15ec-bde7-4848-b29c-5df6b58f1e09	Day 6 chaitra 27.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/17MeQdLVNx608F8Z43aahhr9f-g2bZ07Q/view	2d11121c-1cd5-4ca5-a0c9-738825de8cfa	2025-11-24 15:20:34.414	2025-11-25 10:12:19.164	\N	5
49606994-03c6-4c05-8dc0-ddb1a06bf9bc	Day 7 chaitra 28.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1eNqiHaYAUMypee4qXoTFLdO-lyn281AI/view	2d11121c-1cd5-4ca5-a0c9-738825de8cfa	2025-11-24 15:20:34.415	2025-11-25 10:12:19.164	\N	6
b5528be5-d92d-465a-971b-60cda09dad89	Day 8 chaitra 29.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/18SrsSxYYOgVkInxDQUFR8nraWGScwQZU/view	2d11121c-1cd5-4ca5-a0c9-738825de8cfa	2025-11-24 15:20:34.416	2025-11-25 10:12:19.164	\N	7
5cd2906e-56ce-4f7f-83cf-6e8bbda1b068	Day 9 baishak 4.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1TA0LTvNdEAf2Gx_jL-7WMKD9A7cc8Gj8/view	2d11121c-1cd5-4ca5-a0c9-738825de8cfa	2025-11-24 15:20:34.417	2025-11-25 10:12:19.164	\N	8
2397789d-b3fc-4ccb-ac35-f2ab829683f0	Day 7 magh 16 .mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1ufS2POhf-ncUyRbuYpr5KLka4NYiNcwt/view	4d08317e-614a-4e8e-a180-b68d722cb809	2025-11-24 15:20:34.281	2025-11-25 10:07:14.83	\N	6
d9ea723b-76b2-4c1a-917e-0f89464b302f	Day 8 magh 17.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1sK7V_IMIqOPpCDs_babEGrIIkHd0w8L-/view	4d08317e-614a-4e8e-a180-b68d722cb809	2025-11-24 15:20:34.282	2025-11-25 10:07:14.83	\N	7
9e20b4d6-4270-4d79-bcd1-a0fa4a9fb544	Day 9 magh 18.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/13tbbOGA4gOnd3A5RpaAStfUeevZ-6iv5/view	4d08317e-614a-4e8e-a180-b68d722cb809	2025-11-24 15:20:34.283	2025-11-25 10:07:14.83	\N	8
47bb12b8-e7f7-46c1-9aae-455aed6eeffc	day 16 magh 28.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1qJ6emoTbIqSGW_1lHceJy0WtC8a3T0Ss/view	4d08317e-614a-4e8e-a180-b68d722cb809	2025-11-24 15:20:34.283	2025-11-25 10:07:14.83	\N	15
e806f54b-e98a-4fdf-99fc-9644d53eaa22	samasamahik jestha 5.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1LQrnQDuIBbOCy_GB6H9hUzqLUeDRn9Ku/view	4d08317e-614a-4e8e-a180-b68d722cb809	2025-11-24 15:20:34.284	2025-11-25 10:07:14.83	\N	19
bfd0ee32-9be8-4670-9e98-6ff3bb05da39	Day 10 baishak 5.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1sovlUcBJVcbzDcjkaytv9NKUGlTFfOZ9/view	2d11121c-1cd5-4ca5-a0c9-738825de8cfa	2025-11-24 15:20:34.41	2025-11-25 10:12:19.164	\N	9
97d49e2d-0c91-4278-bb61-75bb7ca99b67	Day 10 baishak 21 ( morning ).mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1Xg0sEkrA_e9oz6kfhQU0Fafql_295kWO/view	5a393e23-ce06-463d-85ed-97f1c71444c6	2025-11-24 15:20:34.423	2025-11-25 10:12:49.197	\N	9
854d80df-f633-4fe1-8040-5f6f7072ebf0	Day 10 mansir 16.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1BUptkvwmnWtoYznZ6REHPVoZrQsjxbWL/view	2a678b73-6f70-4577-9205-c24491cdbecf	2025-11-24 15:20:34.307	2025-11-25 10:09:04.39	\N	10
21e68e37-0d08-4fd1-b8de-26f809df30e3	Day 11 mansir 17.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1FF0ixeFvpkG0OmgpNtznNVqbYKUZuuIP/view	2a678b73-6f70-4577-9205-c24491cdbecf	2025-11-24 15:20:34.307	2025-11-25 10:09:04.39	\N	11
180ba1d1-aafc-4581-b966-80c5ca488932	Day 12 mansir 18.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/12SJKgDN6afd9fpioStXp1PoZOPCN7Y3Z/view	2a678b73-6f70-4577-9205-c24491cdbecf	2025-11-24 15:20:34.308	2025-11-25 10:09:04.39	\N	12
1048f03f-aaac-45f0-ae5e-8f9628fb9de6	Day 13 mansir 19.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1AFJjWVloLMkB06-rxZc5zEPzKzPJzHEM/view	2a678b73-6f70-4577-9205-c24491cdbecf	2025-11-24 15:20:34.309	2025-11-25 10:09:04.39	\N	13
fe022936-b255-4826-9b02-19a6e3b6e8c1	Day 14 mansir 20.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1sppxmOy01HJDZCCrumzFZopyRXDA9x06/view	2a678b73-6f70-4577-9205-c24491cdbecf	2025-11-24 15:20:34.31	2025-11-25 10:09:04.39	\N	14
cde03ebf-4710-451c-9de8-c9aba494c550	Day 15 mansir 21.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1x6lo33BK0Ak_lTKzmobJxWlncnR7IHhm/view	2a678b73-6f70-4577-9205-c24491cdbecf	2025-11-24 15:20:34.311	2025-11-25 10:09:04.39	\N	15
ffe55aa8-176d-40fb-915a-fedafc547bd5	Day 16 mansir 23.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1W2mYg3uEczuB3NYXkHwfZM7n0jZipQjs/view	2a678b73-6f70-4577-9205-c24491cdbecf	2025-11-24 15:20:34.312	2025-11-25 10:09:04.39	\N	16
13f04af1-3f67-42ff-8990-5d7b81024afd	Day 17 mansir 24.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1VpMBVTN50-PmH2p8Ph4IyJHzbO_JHNp6/view	2a678b73-6f70-4577-9205-c24491cdbecf	2025-11-24 15:20:34.313	2025-11-25 10:09:04.39	\N	17
98ac88cf-664f-460d-9b05-435136c8d5c4	Day 18 mansir 25.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1yfzkGPTi6wXsOiFbwvTnzNQbkEHdJquO/view	2a678b73-6f70-4577-9205-c24491cdbecf	2025-11-24 15:20:34.314	2025-11-25 10:09:04.39	\N	18
201f3a23-439d-4fcb-8fb0-4c593e3b4374	Day 19 mansir 27.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1DxQxUKlscmyhs4OIA2mgB9I1Iplwdh1j/view	2a678b73-6f70-4577-9205-c24491cdbecf	2025-11-24 15:20:34.315	2025-11-25 10:09:04.39	\N	19
4c205147-5fb1-4c46-9e05-4e12599b3113	Day 20 mansir 28.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1cBWAC7aiPOhxRog458NkfhIMawLI7H_k/view	2a678b73-6f70-4577-9205-c24491cdbecf	2025-11-24 15:20:34.316	2025-11-25 10:09:04.39	\N	20
9553ff77-191c-458f-aabc-f53303bbd4af	Day 21 mansir 29.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1hHYpblaUyq-I2l_rJ04DkW5GM1eEyGo3/view	2a678b73-6f70-4577-9205-c24491cdbecf	2025-11-24 15:20:34.317	2025-11-25 10:09:04.39	\N	21
190be3eb-561a-4fe8-b736-b4d1b1bdc293	Day 22 mansir 30.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1tI4QB9PwswGa-zLmyFhd4j954WrxpT-M/view	2a678b73-6f70-4577-9205-c24491cdbecf	2025-11-24 15:20:34.32	2025-11-25 10:09:04.39	\N	22
42cc5935-fb41-40fe-9e27-f0f0b236c3aa	1.3 Superposition, Nortons, Thevenins, Maxm Power, Reciprocity.pdf	\N	PDF	https://drive.google.com/file/d/1jNZCjiTFbDBuzZEEZA7LjDZPclg9B610/view	f24c6c6b-c8fc-4e46-a1f3-64647abefd63	2025-11-24 15:20:34.333	2025-11-24 15:20:34.333	\N	0
6723aec4-768f-4ea8-96a5-76c32bcb2462	1.5_Series Parallel AC Circuits (1)_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1BHN_qMRNnfnUdxGtktPqCq_5-hlU2TZp/view	f24c6c6b-c8fc-4e46-a1f3-64647abefd63	2025-11-24 15:20:34.333	2025-11-24 15:20:34.333	\N	0
825c28fb-bf40-40e8-afe4-b4c626f026bc	1.6_Three Phase Systems_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1JQYbHn-PhZjZXIJm0ehpxUGy3lEdec2I/view	f24c6c6b-c8fc-4e46-a1f3-64647abefd63	2025-11-24 15:20:34.334	2025-11-24 15:20:34.334	\N	0
daf4f4ff-ba6c-4371-8d3f-c351f54d0633	1.7 Circuit Analysis by Laplace Transform.pdf	\N	PDF	https://drive.google.com/file/d/1RH8zMrT3v8sgRLMTQ8BmEA5LlJLL5Ptp/view	f24c6c6b-c8fc-4e46-a1f3-64647abefd63	2025-11-24 15:20:34.335	2025-11-24 15:20:34.335	\N	0
94dfcdb3-e617-445c-8675-26235841f5c7	1.7 Circuit Analysis.pdf	\N	PDF	https://drive.google.com/file/d/1magFIziU_VddzxwL3dhdOke5b0hJ5-9L/view	f24c6c6b-c8fc-4e46-a1f3-64647abefd63	2025-11-24 15:20:34.337	2025-11-24 15:20:34.337	\N	0
42ea0faa-5102-4840-829f-1c98bb8e127e	1.7 Inverting and Non-inverting Amplifier.pdf	\N	PDF	https://drive.google.com/file/d/1kZqIwoA0bM2w6qg8wpSYmw9MCyKJAdrM/view	f24c6c6b-c8fc-4e46-a1f3-64647abefd63	2025-11-24 15:20:34.339	2025-11-24 15:20:34.339	\N	0
10d1b7c0-44fe-43b1-80f4-8fa161d24131	1.7 Transfer Function (1).pdf	\N	PDF	https://drive.google.com/file/d/123rlsDyvLdgYUviylKb9ZvHrESbWPqi5/view	f24c6c6b-c8fc-4e46-a1f3-64647abefd63	2025-11-24 15:20:34.339	2025-11-24 15:20:34.339	\N	0
e5cc9388-1f24-432e-8f32-d0ee480e8760	1.7 Transfer Function (2).pdf	\N	PDF	https://drive.google.com/file/d/1sBHziqgVdqYnpAJ4QZMN7FstxsDYwuyY/view	f24c6c6b-c8fc-4e46-a1f3-64647abefd63	2025-11-24 15:20:34.34	2025-11-24 15:20:34.34	\N	0
87022ff0-a23e-4f9f-a046-568c0fe238c6	1.7 Transfer Function.pdf	\N	PDF	https://drive.google.com/file/d/1jXIjKlTvbJmP2x9OU8aASy1k51S3jK8O/view	f24c6c6b-c8fc-4e46-a1f3-64647abefd63	2025-11-24 15:20:34.341	2025-11-24 15:20:34.341	\N	0
b54c975e-f1ae-4a40-b6d8-a2819c287a2e	1.7 Two Port Networks.pdf	\N	PDF	https://drive.google.com/file/d/1tqLo407oQumdbBXBBSoq9ZOvtcKR4ryL/view	f24c6c6b-c8fc-4e46-a1f3-64647abefd63	2025-11-24 15:20:34.342	2025-11-24 15:20:34.342	\N	0
554a0354-2f85-470c-8ae1-d8506ed949e3	Chapter 10 Safety Engineering Part 1_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1Vg6KJSQo5IxCPqwZ0hZG3-0HXfsllQv5/view	4efa5a9e-8f60-4a0b-a3e1-3676340f2f15	2025-11-24 15:20:34.344	2025-11-24 15:20:34.344	\N	0
cd0eb713-3b94-4aef-9fe4-1843ed763593	Chapter 10 Safety Engineering Part 2_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1FzBdmLQ_Lci8WSnNzJ7W8ic5_26tHoBg/view	4efa5a9e-8f60-4a0b-a3e1-3676340f2f15	2025-11-24 15:20:34.345	2025-11-24 15:20:34.345	\N	0
7814dce9-eb11-47db-a7b5-9f22b2fb99be	Safety Engineering_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1pceGyijWdGPtY_2WCCDlkrVi585jGFtd/view	4efa5a9e-8f60-4a0b-a3e1-3676340f2f15	2025-11-24 15:20:34.346	2025-11-24 15:20:34.346	\N	0
407b1ff7-0ea4-42c8-b548-9ce53da5e2ca	Automatic feedback control system_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1noJ9lEIWp21WQ6K0h41hUZ8aKWbHcdqY/view	39ca2d2e-876d-41e0-af9e-97a0a08da1c8	2025-11-24 15:20:34.347	2025-11-24 15:20:34.347	\N	0
ccac7265-ae65-4a16-a33e-3123c18689d6	PID_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1WH8V-iVziSyIKykIWqOW0mn3pncK5bp7/view	39ca2d2e-876d-41e0-af9e-97a0a08da1c8	2025-11-24 15:20:34.348	2025-11-24 15:20:34.348	\N	0
17aea3cf-8aa2-4030-b73b-6d0a904f0940	electrical measurements_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1ziI3QU6FB759ICONi-IZYSdZK6_sqrep/view	39ca2d2e-876d-41e0-af9e-97a0a08da1c8	2025-11-24 15:20:34.349	2025-11-24 15:20:34.349	\N	0
5e967ee8-eb1c-468e-a2c4-e4516b203787	sensors and transducers_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1CM5ySgFCNs3Nfn62LBKBOWyUHjoIc-0H/view	39ca2d2e-876d-41e0-af9e-97a0a08da1c8	2025-11-24 15:20:34.35	2025-11-24 15:20:34.35	\N	0
d666e925-e367-495c-a7a2-739b34545bad	12.1 Technical Standards_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1F5Ja9KXlWfnYogqV4mfb8jmumYLasiaT/view	9ceea9d2-c954-490d-8ea6-359d76dc10f5	2025-11-24 15:20:34.352	2025-11-24 15:20:34.352	\N	0
4713a5a8-d017-4512-a81d-2e6b7fb35e0f	12.2 Accreditation_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1Kv5lZcX0XuVv55xk1fQXzRAuv2YaJuSA/view	9ceea9d2-c954-490d-8ea6-359d76dc10f5	2025-11-24 15:20:34.355	2025-11-24 15:20:34.355	\N	0
267c0c97-14e9-480b-8606-abc7b3d91dd2	12.3 Calibration.pdf	\N	PDF	https://drive.google.com/file/d/1FQVhmyFUR0NqKQPgaOT-q-kT4g2Q-pmK/view	9ceea9d2-c954-490d-8ea6-359d76dc10f5	2025-11-24 15:20:34.357	2025-11-24 15:20:34.357	\N	0
b2e6a0ca-5f99-43d8-af87-cd4dafa16487	2.1_Magnetic Circuits.pdf	\N	PDF	https://drive.google.com/file/d/1YUUaguy17GARx07UiKSsSkFgX2QrTfBp/view	1a378efa-dba8-45ad-ab62-3ea212a47338	2025-11-24 15:20:34.359	2025-11-24 15:20:34.359	\N	0
c76302d4-5863-4a55-9a73-4637c43bf08b	2.2_Transformers.pdf	\N	PDF	https://drive.google.com/file/d/1HMvbOVxvEhj6AEuVTl7d689WwLw6O1jN/view	1a378efa-dba8-45ad-ab62-3ea212a47338	2025-11-24 15:20:34.36	2025-11-24 15:20:34.36	\N	0
77204f71-92fb-4701-9b62-46a78ef4de1c	2.3_DC Machines.pdf	\N	PDF	https://drive.google.com/file/d/1WkmqgbpFI5hVvGWA4SiteANSdI10-c_F/view	1a378efa-dba8-45ad-ab62-3ea212a47338	2025-11-24 15:20:34.361	2025-11-24 15:20:34.361	\N	0
3e0d9b94-7555-44c8-99d3-7eb3ecbeaa5e	2.4_Synchronous Machines.pdf	\N	PDF	https://drive.google.com/file/d/11AwFTwmaGMDhuDxrovOf9psMnMiuFJHL/view	1a378efa-dba8-45ad-ab62-3ea212a47338	2025-11-24 15:20:34.362	2025-11-24 15:20:34.362	\N	0
9987e4f8-6760-430a-a066-180b115188a3	2.5 Induction Generator.pdf	\N	PDF	https://drive.google.com/file/d/1ih_3JP1SuJgAcwu31inDgek3wTC7BTl_/view	1a378efa-dba8-45ad-ab62-3ea212a47338	2025-11-24 15:20:34.363	2025-11-24 15:20:34.363	\N	0
7cbe2072-7438-4bd5-a3f9-39b1d062e0b1	2.5_Induction Machines.pdf	\N	PDF	https://drive.google.com/file/d/18KzvPN_f5rt0FO0lrt-eizdncEx2GFxJ/view	1a378efa-dba8-45ad-ab62-3ea212a47338	2025-11-24 15:20:34.364	2025-11-24 15:20:34.364	\N	0
820c8956-df7d-416f-a1c1-40c1eb6d6a1b	Applications of Various Motors.pdf	\N	PDF	https://drive.google.com/file/d/1fVVpl5ALT6gIMRjdgSy0LarfICDZ-g6u/view	1a378efa-dba8-45ad-ab62-3ea212a47338	2025-11-24 15:20:34.365	2025-11-24 15:20:34.365	\N	0
e2359c99-e462-4096-8257-790966d2bf1a	Speed Control of Induction Motors.pdf	\N	PDF	https://drive.google.com/file/d/1fVPZWkvsuiz4gTVkgbBYkjNZNEzCxDrC/view	1a378efa-dba8-45ad-ab62-3ea212a47338	2025-11-24 15:20:34.366	2025-11-24 15:20:34.366	\N	0
ef42471e-c7c2-4985-9240-625a559c5b75	4.1 Sag and Tension_watermark.pdf	\N	PDF	https://drive.google.com/file/d/13TruYSWC_eNBodQx5fEtQdj6YxbUWTnR/view	573acc82-fd65-4434-b134-3985a902b907	2025-11-24 15:20:34.368	2025-11-24 15:20:34.368	\N	0
2129e279-1be9-4fd1-ae11-de05e4af77a5	4.1 Surge Impedance Loading_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1fiIYpFZEFAFPD8epk7N4uPI8e3fKZhGL/view	573acc82-fd65-4434-b134-3985a902b907	2025-11-24 15:20:34.369	2025-11-24 15:20:34.369	\N	0
b710b4d1-0316-4a02-b3f9-19d14abde6fa	4.1 Vibration Dampers (1)_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1xoL3rULGtmw4GgqilIoMhhSRKWruRSao/view	573acc82-fd65-4434-b134-3985a902b907	2025-11-24 15:20:34.37	2025-11-24 15:20:34.37	\N	0
1cf3ac66-a78a-43e2-90db-787659acb410	4.2 ABCD parameter (1).pdf	\N	PDF	https://drive.google.com/file/d/1vjr7qlWkpZCXxRx3S54HBhPO9-8q9Zfn/view	573acc82-fd65-4434-b134-3985a902b907	2025-11-24 15:20:34.37	2025-11-24 15:20:34.37	\N	0
6ba80b60-9412-4f68-afe5-6597b0765762	4.2 Ferranti Effect_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1gzXkPc0jX6J9NbNbbtEXXU0g8-ut2WPy/view	573acc82-fd65-4434-b134-3985a902b907	2025-11-24 15:20:34.371	2025-11-24 15:20:34.371	\N	0
397c2ef0-6c7c-4417-aae2-07591094bfd6	4.2 Performance of Tr. Lines_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1zX0dUR9k0plAbn1XLS3b--p4G7pn5beV/view	573acc82-fd65-4434-b134-3985a902b907	2025-11-24 15:20:34.372	2025-11-24 15:20:34.372	\N	0
94a5d9d4-f47f-4ee9-8f97-cb0eea9625db	4.2 V.R. of capacitive load (1).pdf	\N	PDF	https://drive.google.com/file/d/1SV6gXiP2XOEZ2HifBK-V-gfUg5nUIbBw/view	573acc82-fd65-4434-b134-3985a902b907	2025-11-24 15:20:34.373	2025-11-24 15:20:34.373	\N	0
9ec1b545-7e9b-4a00-ba6f-3c319a61bed3	4.3 Corona Inception Voltage_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1-NB8MS8Q8eglObAOIEk1p8ZaI00GSTh7/view	573acc82-fd65-4434-b134-3985a902b907	2025-11-24 15:20:34.374	2025-11-24 15:20:34.374	\N	0
2a92b5aa-62b7-4992-851a-09bf39b9d359	4.3 Corona_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1oG3VAosggzVSHQK1rmDzMtm2k-ohMobZ/view	573acc82-fd65-4434-b134-3985a902b907	2025-11-24 15:20:34.374	2025-11-24 15:20:34.374	\N	0
3dd66f9b-71df-445c-acf3-5b44e015f4a0	4.5 Bus Bar Schemes_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1aPulAJh9XM9bG_jXaiz5qSkdbhxnTrwX/view	573acc82-fd65-4434-b134-3985a902b907	2025-11-24 15:20:34.375	2025-11-24 15:20:34.375	\N	0
468f3810-c6b4-447c-b756-e69b29501fec	4.5 Distribution Components of Distribution System_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1oRIFuhKeu8GjwAYPUuciSGxru4LTxci0/view	573acc82-fd65-4434-b134-3985a902b907	2025-11-24 15:20:34.376	2025-11-24 15:20:34.376	\N	0
e2e436a1-9a7e-401d-84c6-b6fd08cb602e	4.5 Distribution System (1)_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1q0rv5_jmb1Bg-fsJe7sQlwkkCQLxMKCY/view	573acc82-fd65-4434-b134-3985a902b907	2025-11-24 15:20:34.377	2025-11-24 15:20:34.377	\N	0
6053f9c3-dc92-49e7-80f2-fe2986e3e4c7	4.5 Distribution System Schemes, Pole Types, Insulator Types_watermark (1).pdf	\N	PDF	https://drive.google.com/file/d/1x47-e9h8cDA7wOZA75sihZMaBhtwQXO_/view	573acc82-fd65-4434-b134-3985a902b907	2025-11-24 15:20:34.377	2025-11-24 15:20:34.377	\N	0
c49e1e19-1a2e-46eb-8625-e4d8920641c2	4.5 Key Design Considerations for Conductor Size Selection in Distribution Systems_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1SOdGiNXW16UIRe4wbIH1k6OtH-4s8eM4/view	573acc82-fd65-4434-b134-3985a902b907	2025-11-24 15:20:34.378	2025-11-24 15:20:34.378	\N	0
d8cb76e0-8dce-48bd-822f-b19cc8a3469b	4.5 Substation Location and Size criteria_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1O0pSLmc9342yP-Uix2oMQHKusIneaX08/view	573acc82-fd65-4434-b134-3985a902b907	2025-11-24 15:20:34.379	2025-11-24 15:20:34.379	\N	0
5ec75bde-1a2c-4cc2-b646-8e570d3d8132	My Note part 2_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1fQwSg55ODxif5cmYrXeUurEhDoLMaqJD/view	573acc82-fd65-4434-b134-3985a902b907	2025-11-24 15:20:34.38	2025-11-24 15:20:34.38	\N	0
00a47c05-04e7-4965-ac4f-71bf1305759a	Why Transmission Lines are designed for the WORST PROBABLE CONDITIONS_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1BiBU6pIFB8AxMSAeCf5bpbMeo5_-7gc5/view	573acc82-fd65-4434-b134-3985a902b907	2025-11-24 15:20:34.38	2025-11-24 15:20:34.38	\N	0
eec65ca8-527f-47f2-ab5c-ef3a98cf1308	5.1 P-f and Q-V Balance_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1G7pZOXGZWmLuxvXwNPwk_5F1SkHEcvdc/view	b7eeeafa-ad40-468f-8e06-c2ad6d865b1a	2025-11-24 15:20:34.382	2025-11-24 15:20:34.382	\N	0
61bee969-d0c2-4d84-880f-a7b27d62b8d2	5.1 Power Flow_watermark.pdf	\N	PDF	https://drive.google.com/file/d/14_VlBElmG7w5b6cvKSZfUN7-Chj76mob/view	b7eeeafa-ad40-468f-8e06-c2ad6d865b1a	2025-11-24 15:20:34.383	2025-11-24 15:20:34.383	\N	0
bda0292c-8edb-4e75-a355-df7a5c91c474	5.1 Solve equations using iterative methods_watermark.pdf	\N	PDF	https://drive.google.com/file/d/19-xoCuJdeXy75lEZXdKcWCWdukvQnPrp/view	b7eeeafa-ad40-468f-8e06-c2ad6d865b1a	2025-11-24 15:20:34.385	2025-11-24 15:20:34.385	\N	0
a0bd254a-1e3b-4407-8d02-bb309f8db6e7	5.1 Voltage Profile of a Transmission Line_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1zkQsOW_FPQCEY5_IQgRFwa3JF9p0OUqE/view	b7eeeafa-ad40-468f-8e06-c2ad6d865b1a	2025-11-24 15:20:34.388	2025-11-24 15:20:34.388	\N	0
6ac15fab-e803-40ef-8213-e6f7826362e0	5.2 Faults in Power System.pdf	\N	PDF	https://drive.google.com/file/d/1CHFmHGy6SUg4TlialMu17K3h9Fxnl-tZ/view	b7eeeafa-ad40-468f-8e06-c2ad6d865b1a	2025-11-24 15:20:34.39	2025-11-24 15:20:34.39	\N	0
3f0616fc-aad8-40d2-8a0e-8f2b718b9db0	5.2 Power System Stability.pdf	\N	PDF	https://drive.google.com/file/d/1ifHh2B61wbrdHo_Vl_xJE7f8h153Hf_2/view	b7eeeafa-ad40-468f-8e06-c2ad6d865b1a	2025-11-24 15:20:34.391	2025-11-24 15:20:34.391	\N	0
aa300d03-7afb-4290-8f36-a5de481bff9f	5.3 Faults in Power System.pdf	\N	PDF	https://drive.google.com/file/d/15B5fOEESh8qyL-fU2k4KLWATrbWAaLtp/view	b7eeeafa-ad40-468f-8e06-c2ad6d865b1a	2025-11-24 15:20:34.392	2025-11-24 15:20:34.392	\N	0
864e75af-d325-4623-969c-52ee3cf9e280	5.3 Generator Protection.pdf	\N	PDF	https://drive.google.com/file/d/11tVABgK4jAt6xFgeOu8RTx79_c9jJ5-q/view	b7eeeafa-ad40-468f-8e06-c2ad6d865b1a	2025-11-24 15:20:34.393	2025-11-24 15:20:34.393	\N	0
ead9fd59-394a-478e-9005-06035b5e0980	5.3 TL & Feeder protection.pdf	\N	PDF	https://drive.google.com/file/d/1iYcI_2bWsSo5fZYOCGawOaTOuBX6R8gL/view	b7eeeafa-ad40-468f-8e06-c2ad6d865b1a	2025-11-24 15:20:34.394	2025-11-24 15:20:34.394	\N	0
971c9da1-0b46-4147-85a4-091151f1c5e4	5.3 Transformer Protection.pdf	\N	PDF	https://drive.google.com/file/d/1gMNB1FSGPhfI3fSGsOJIivChmjWFkO4l/view	b7eeeafa-ad40-468f-8e06-c2ad6d865b1a	2025-11-24 15:20:34.395	2025-11-24 15:20:34.395	\N	0
9b859950-7a2d-4553-b703-9e67e061860d	5.4 ABT and Load Dispatcher.pdf	\N	PDF	https://drive.google.com/file/d/1_ffAwGvuGVKRxuVYaw676rF2aDoKjbaw/view	b7eeeafa-ad40-468f-8e06-c2ad6d865b1a	2025-11-24 15:20:34.395	2025-11-24 15:20:34.395	\N	0
104c3d38-d615-4429-ab74-bcc63884c787	5.4 Choice of Tr. Voltage, ROW.pdf	\N	PDF	https://drive.google.com/file/d/19xzEa4W7YuCNxTfr2MvPvrA3EymieYUa/view	b7eeeafa-ad40-468f-8e06-c2ad6d865b1a	2025-11-24 15:20:34.396	2025-11-24 15:20:34.396	\N	0
e31688a9-9ac3-4a02-9137-e574d7cc4086	5.4 Load Dispatch.pdf	\N	PDF	https://drive.google.com/file/d/12FI6H8MjCl-2eCyL8sMKuVO790cL_wFF/view	b7eeeafa-ad40-468f-8e06-c2ad6d865b1a	2025-11-24 15:20:34.397	2025-11-24 15:20:34.397	\N	0
8d895279-e753-41f7-b593-6fb720fa7a3e	5.4 Tools and Benefits of Economic Load Dispatch.pdf	\N	PDF	https://drive.google.com/file/d/1lyJNv559BmuO6_Z2ZimnyIGyBELK9yUq/view	b7eeeafa-ad40-468f-8e06-c2ad6d865b1a	2025-11-24 15:20:34.398	2025-11-24 15:20:34.398	\N	0
01485f42-2d0b-4bab-80f7-0ab16e9ccbaf	Day 1 falgun 14.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1GUnz0N6XW_9r6aOnZeBFlmNhhPZodvaZ/view	ae3b2426-d083-43fd-8568-d58e230597db	2025-11-24 15:20:34.4	2025-11-24 15:20:34.4	\N	0
b7cda6d0-4fc5-4fac-b651-7ad57f48405b	Day 2 falun 15.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1VSLDKB6WPmzav5Ejl4pKAoeql1THukXD/view	ae3b2426-d083-43fd-8568-d58e230597db	2025-11-24 15:20:34.401	2025-11-24 15:20:34.401	\N	0
67b0b06f-0971-43bd-b271-a60eea70b5ee	Day 3 falgun 16.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1HQU0TiykD-xZ1My74fb0gAXE2YHhiwpZ/view	ae3b2426-d083-43fd-8568-d58e230597db	2025-11-24 15:20:34.402	2025-11-24 15:20:34.402	\N	0
8320bf75-21a1-49e3-9eb6-148a941f1b6b	Day 4 baishak 22 ( morning ) .mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1DJdzrx27L4suKZJuMI-jIF-XoQJ5jQk2/view	ae3b2426-d083-43fd-8568-d58e230597db	2025-11-24 15:20:34.403	2025-11-24 15:20:34.403	\N	0
9aa955a8-ee86-45e2-9350-a0f09d99d2f5	Day 1 falgun 20.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1zETEXCO0EyPABxcya3QnzVHc-ZvUbVlR/view	fe06efbf-8a5d-4967-84a6-623195a7321b	2025-11-24 15:20:34.406	2025-11-24 15:20:34.406	\N	0
5467aa10-5cd4-4331-b281-3fe25c1575d4	Day 2.falgun 26mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/124rqHhogTJPo-YMRGmuwZlPDdeCFGyfU/view	fe06efbf-8a5d-4967-84a6-623195a7321b	2025-11-24 15:20:34.406	2025-11-24 15:20:34.406	\N	0
eaf161dd-e034-4a5c-a790-8898127c8dc6	Day 1 baishak 16.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1SmMtPmhCUowFFDs3euIWn9UviMeLu7V1/view	2fdfa191-3b76-4970-881e-e35519ba84ed	2025-11-24 15:20:34.418	2025-11-24 15:20:34.418	\N	0
4edb2ae4-69f1-4053-bae3-f1a88f41cfd9	Day 2 baishak 17.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/175lA5sE4d0lx7qnL8O_MCPHHlAGmEmf4/view	2fdfa191-3b76-4970-881e-e35519ba84ed	2025-11-24 15:20:34.419	2025-11-24 15:20:34.419	\N	0
f58c7028-c708-4f8c-976f-3439fdbf35b7	Day 3 baishak 18.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1dfcc6ZAcXpVVSYDe1ZX1Z8ObY7xDMyrr/view	2fdfa191-3b76-4970-881e-e35519ba84ed	2025-11-24 15:20:34.42	2025-11-24 15:20:34.42	\N	0
41bcee59-0acf-445a-b953-d27aab6c30ba	Day 4 baishak 19.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1kOx-PWhjHrtvnuzmHpJlyeh7pjiNnK_C/view	2fdfa191-3b76-4970-881e-e35519ba84ed	2025-11-24 15:20:34.421	2025-11-24 15:20:34.421	\N	0
b6b6a7b0-0c11-43b2-8a19-5e4f148565ef	Day 1 falgun 18.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1N2T7LgZJAFK_eyXzX9o0rfuqrYHu5DZ7/view	5a393e23-ce06-463d-85ed-97f1c71444c6	2025-11-24 15:20:34.423	2025-11-25 10:12:49.197	\N	0
1883a667-f2d6-4ba9-9c92-c4550418a7e6	Day 2 falgun 19.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1w-nRobMeH4HeyyUSbMXwz3T6nLKWRhTz/view	5a393e23-ce06-463d-85ed-97f1c71444c6	2025-11-24 15:20:34.424	2025-11-25 10:12:49.197	\N	1
c5b807a9-e145-4e4b-8b2a-a0b28a384513	Day 3 falgun 22.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1WZwziCJwA3h1BxlN8Ag5XQ5dL0LTIu5V/view	5a393e23-ce06-463d-85ed-97f1c71444c6	2025-11-24 15:20:34.425	2025-11-25 10:12:49.197	\N	2
9c36ffce-da83-405f-a1b7-88e5e214fe9a	Day 4 falgun 23.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1f6lkIQN-0ll-gYAxFj72AJLWMVXQ74rY/view	5a393e23-ce06-463d-85ed-97f1c71444c6	2025-11-24 15:20:34.428	2025-11-25 10:12:49.197	\N	3
5966d0c0-9f7c-46f5-a901-22562323483b	Day 5 falgun 25.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1Z628UsD_pRbpemcABKJKWip3o5_TKUfq/view	5a393e23-ce06-463d-85ed-97f1c71444c6	2025-11-24 15:20:34.429	2025-11-25 10:12:49.197	\N	4
42812356-0fc7-471a-a769-56e73b4ed866	Day 6 falgun 27.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1_ATzH2ze6p8DVBGeKEB4x1FevibxIUhG/view	5a393e23-ce06-463d-85ed-97f1c71444c6	2025-11-24 15:20:34.429	2025-11-25 10:12:49.197	\N	5
57ad60a2-df4d-4511-93ac-4508f615d7bf	Day 7 falgun 28.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1J9v7ksPmbY6jZhBTCI5HAgCC26YX0kSC/view	5a393e23-ce06-463d-85ed-97f1c71444c6	2025-11-24 15:20:34.43	2025-11-25 10:12:49.197	\N	6
89c967c2-a71e-4973-9fd0-5ea90a2ac839	Day 8 chaitra 3 .mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1KaODXBsOCgSBM_Qn03gYwMmv9RG-v0IY/view	5a393e23-ce06-463d-85ed-97f1c71444c6	2025-11-24 15:20:34.431	2025-11-25 10:12:49.197	\N	7
106fe158-124b-4e1b-a343-907fc4048184	Day 9  baishak 1.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1SlTfF8WkFret3AqI03MThYgVTn-3vWDc/view	5a393e23-ce06-463d-85ed-97f1c71444c6	2025-11-24 15:20:34.432	2025-11-25 10:12:49.197	\N	8
56c3a6fc-358c-4798-b03e-cbc11b2c81ea	Day 10 chaitra 17.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/17NBvdaukKhXIk4vFYxNMESFlcaBNuHlB/view	f7ddc6e7-ffa6-46bc-89b6-9ceca67a2058	2025-11-24 15:20:34.434	2025-11-25 10:13:59.062	\N	9
134f6226-3b22-4e2d-b802-831746211ca4	Day 11 chaitra 18.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1s8mc8d3D_3JdL8tJf1X2zHAhcUmOJYYp/view	f7ddc6e7-ffa6-46bc-89b6-9ceca67a2058	2025-11-24 15:20:34.435	2025-11-25 10:13:59.062	\N	10
595828fe-1e0b-4551-b0ea-acad3f378d2c	Day 1 chaitra 4 .mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1P4IIvG5Kdzeb7yoYgcCHjGxBGum1bFTB/view	f7ddc6e7-ffa6-46bc-89b6-9ceca67a2058	2025-11-24 15:20:34.434	2025-11-25 10:13:59.062	\N	0
48168ccb-33c2-441c-b61d-2e894fec26da	Day 1 baishak 7.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1mEc70PfzG2e7Mz7gL419omu0QsadiO_t/view	63505dc8-883d-4714-844a-20cb0022ef37	2025-11-24 15:20:34.45	2025-11-24 15:20:34.45	\N	0
0b105a69-3350-493e-965a-7f36e8f846b9	Day 2 baishak 8.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1ty-NMs7PQBi_LSaPO7UZwL7W0FeP59iA/view	63505dc8-883d-4714-844a-20cb0022ef37	2025-11-24 15:20:34.451	2025-11-24 15:20:34.451	\N	0
dd2e090a-edcf-4d3d-9fbd-b07376db66b9	Day 4  baishak 10.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1P-_nhVyGxWwnGx6P6o_gs7KTAGUMBucD/view	63505dc8-883d-4714-844a-20cb0022ef37	2025-11-24 15:20:34.452	2025-11-24 15:20:34.452	\N	0
717b67a7-fd2c-4485-a950-dfdfc6496e72	Day 5 baishak 11.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1xHSmeZL2wuK-VdFGRAGBIOS-TNgZB4EK/view	63505dc8-883d-4714-844a-20cb0022ef37	2025-11-24 15:20:34.454	2025-11-24 15:20:34.454	\N	0
8f067783-3341-4f09-858a-3ef23442ea9e	Day 7 baishak 13.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/157GNeqtsT9uYOBHoAjC5JJRiddTLRyn5/view	63505dc8-883d-4714-844a-20cb0022ef37	2025-11-24 15:20:34.456	2025-11-24 15:20:34.456	\N	0
c89e1041-0ebd-4882-8cfa-29189bb260e9	Day 8 baishak 14.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1i5tGxrMAQ58O5-Dpj4chdlH3tPMJyUdH/view	63505dc8-883d-4714-844a-20cb0022ef37	2025-11-24 15:20:34.457	2025-11-24 15:20:34.457	\N	0
35f59ea1-438e-4b37-829a-e12fda384d5b	Day 9 baishak 15.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1zFBHZdxywS1ek8SSNsRhu4opTAldHWVt/view	63505dc8-883d-4714-844a-20cb0022ef37	2025-11-24 15:20:34.458	2025-11-24 15:20:34.458	\N	0
ede2304e-d2c9-474f-a810-735dddbfc526	day 3 baishak 9.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/17XGUnnWj1o-2SdbqQY1klHyxWU8VMlFt/view	63505dc8-883d-4714-844a-20cb0022ef37	2025-11-24 15:20:34.458	2025-11-24 15:20:34.458	\N	0
299bcdee-07f5-4a66-84e0-4e7564ec2b58	Day 1 baishak 20 ( morning ) .mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1X-Z5qW10LDB5tuKg58iN_88X55QpMHW-/view	05768167-c49e-49ab-b573-d387dce78038	2025-11-24 15:20:34.46	2025-11-24 15:20:34.46	\N	0
3279e73c-e2d5-481d-803b-d76396cb0739	Day 3 baishak 21 ( evening) .mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1K8Dkd3B0URC9LyIW7kvjR6PhQ_efvJ8w/view	05768167-c49e-49ab-b573-d387dce78038	2025-11-24 15:20:34.461	2025-11-24 15:20:34.461	\N	0
4cc13fe1-67b4-491d-911e-dfb521d5aa31	Day 4 baishak 27.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1WuKeyD8YV_SRTKXtxi-ZzefRZj434qGs/view	05768167-c49e-49ab-b573-d387dce78038	2025-11-24 15:20:34.462	2025-11-24 15:20:34.462	\N	0
0ba8fbd1-86b7-4d72-9711-9ae75a6961c8	Day2 baishak 20 ( Evening ).mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/11ez_4AJWDOTliRlyAo9rN6ar4WCgt4fk/view	05768167-c49e-49ab-b573-d387dce78038	2025-11-24 15:20:34.463	2025-11-24 15:20:34.463	\N	0
c7d964b6-f782-444e-9ffe-c8b09f16a5ac	Day 3 chaitra 6.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1EhCDToCouOIgWwVp40wjVBhFhpm1SyJ9/view	f7ddc6e7-ffa6-46bc-89b6-9ceca67a2058	2025-11-24 15:20:34.441	2025-11-25 10:13:59.062	\N	2
60c8c9f6-16d0-494a-ab0e-271027284654	Day 4 chaitra 7.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/15i8hMHF_OcxLNXKpkDuUcle9BiaZi2hi/view	f7ddc6e7-ffa6-46bc-89b6-9ceca67a2058	2025-11-24 15:20:34.442	2025-11-25 10:13:59.062	\N	3
61997463-773e-4001-b8e5-9c5e134ce085	Day 5 chaitra 10.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1lQyEQ925QoAxPxhbyvNiifkBkBK-pEKb/view	f7ddc6e7-ffa6-46bc-89b6-9ceca67a2058	2025-11-24 15:20:34.443	2025-11-25 10:13:59.062	\N	4
4f07c0e6-7790-4fa0-ba4e-ccd474a48265	Day 12 baishak 2.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1ApEsqhhbNJ2Gklt8GHpHTmSXG-gwtlzV/view	f7ddc6e7-ffa6-46bc-89b6-9ceca67a2058	2025-11-24 15:20:34.436	2025-11-25 10:13:59.062	\N	11
9a5dcbd9-8778-48f0-9bf4-faeded5faad5	Day 13 baishak 3 .mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1mKVVvv0FzglBU-9GQ99WiWX6S0zph2O1/view	f7ddc6e7-ffa6-46bc-89b6-9ceca67a2058	2025-11-24 15:20:34.437	2025-11-25 10:13:59.062	\N	12
6b546896-a526-4479-ae1f-aae86a032037	Day 14 baishak 17 ( morning ) .mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/11ZcEwPlWf3P4tuzvhF-IsJt4oJIAFSO4/view	f7ddc6e7-ffa6-46bc-89b6-9ceca67a2058	2025-11-24 15:20:34.438	2025-11-25 10:13:59.062	\N	13
baa89edf-acd3-45bb-a8ad-ddb4e6750d16	Day 15 baishak 19 ( morning ) .mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1mCo3yK5OL8khSWCOB0LdED4xjTvAMMW8/view	f7ddc6e7-ffa6-46bc-89b6-9ceca67a2058	2025-11-24 15:20:34.439	2025-11-25 10:13:59.062	\N	14
e34650e0-3e24-4aa8-b25c-a77b351a96d7	Day 16 baishak 18 ( morning ) .mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1_ENpF3721dKMPauZnZvTP39f5jZjoBUW/view	f7ddc6e7-ffa6-46bc-89b6-9ceca67a2058	2025-11-24 15:20:34.439	2025-11-25 10:13:59.062	\N	15
bcf3df96-0903-4ad7-99c0-d7b47ea14134	Day 2 chaitra 5.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1W1MXK2JZ723vHprwGMLGshShN0rz_cl5/view	f7ddc6e7-ffa6-46bc-89b6-9ceca67a2058	2025-11-24 15:20:34.44	2025-11-25 10:13:59.062	\N	1
108012b7-2219-459c-aeb0-80dfbde8e6b6	Day 3 poush 4.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1kf_GXHqUXfeqhrJzHV1PS86z1E4ml9Bh/view	68da139c-2869-40a5-b3f4-1ba629ee48c9	2025-11-24 15:20:34.297	2025-11-24 15:40:57.832	\N	2
94d578a2-7228-4219-9c20-b6782a643c65	Day 4 poush 6.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1JTYHSoaa1Tfc7Uc6qPJvq1cbUKje9irN/view	68da139c-2869-40a5-b3f4-1ba629ee48c9	2025-11-24 15:20:34.299	2025-11-24 15:40:57.832	\N	3
7e9619a2-e6f5-4e10-84e2-d18342fe37ef	Day 5 poush 7 .mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1by5qny_LKv-zDP8BJWCwvi_jRAIk22SL/view	68da139c-2869-40a5-b3f4-1ba629ee48c9	2025-11-24 15:20:34.301	2025-11-24 15:40:57.832	\N	4
a5043fe0-7cdd-4d12-83af-ed4f187a344e	Day 6 poush 8.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1xJIMbHZdJRqqnfTWMhyirXjpP517R4nf/view	68da139c-2869-40a5-b3f4-1ba629ee48c9	2025-11-24 15:20:34.302	2025-11-24 15:40:57.832	\N	5
9cb28588-c4f5-47e6-8fb7-c07d634ea3a0	Day 12 Poush 17.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/111wTgK3WN5peLjzaS01XvIj1G4R5Cksv/view	68da139c-2869-40a5-b3f4-1ba629ee48c9	2025-11-24 15:20:34.289	2025-11-24 15:40:57.832	\N	11
5cef325a-acaa-4ac8-9b88-0ec1435aa402	Day 13 Poush 18.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1JQIJqbf5u9Ng9CSYYNMSVDoFYaRxpDdf/view	68da139c-2869-40a5-b3f4-1ba629ee48c9	2025-11-24 15:20:34.291	2025-11-24 15:40:57.832	\N	12
195bafc4-cb17-4abd-a0d4-34f19fa665dc	Day 14 poush 21.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1u-5_bzYUkA62df_UBQdmFHT9V2oAAmzE/view	68da139c-2869-40a5-b3f4-1ba629ee48c9	2025-11-24 15:20:34.292	2025-11-24 15:40:57.832	\N	13
8be1d29a-2d07-442e-8c61-dd11ac5ac034	Day 15 poush 22.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1na-OVxbYp9uBvImFECy-l3E0dpmttJ27/view	68da139c-2869-40a5-b3f4-1ba629ee48c9	2025-11-24 15:20:34.293	2025-11-24 15:40:57.832	\N	14
5d7cf854-4e08-4e20-a122-a086a141c882	Day 16 Poush 24.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1K_RhMCKw8IR0_hjIbn_r8WvC4_IXrh6g/view	68da139c-2869-40a5-b3f4-1ba629ee48c9	2025-11-24 15:20:34.294	2025-11-24 15:40:57.832	\N	15
559ac861-fc88-4d06-a719-33037f224522	Day 17  Poush 25.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1yqfJHc3WXUUZn4YT61L_0_YMyj-XbM_4/view	68da139c-2869-40a5-b3f4-1ba629ee48c9	2025-11-24 15:20:34.295	2025-11-24 15:40:57.832	\N	16
fbe4d3fc-ad1a-4a6d-a4b3-2d21df8025cb	Chapter 4. Resource Scheduling (1)_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1pQC0W5tN1dLRABDndFlk_FmlpCQwzpNF/view	6b79750e-45d4-49c2-8a0a-22759655be40	2025-11-24 15:20:34.185	2025-11-25 10:05:48.242	\N	12
7a30f0fc-927d-4a55-b567-a060b9f567af	Chapter 4. Tariff Structure (1)_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1Ndr-O7JHBDle9E5SXYdSjP85M0O--EnT/view	6b79750e-45d4-49c2-8a0a-22759655be40	2025-11-24 15:20:34.187	2025-11-25 10:05:48.242	\N	13
5543793c-d0dd-4fea-9a8b-3c42c9f9dafd	Day 6 chaitra 11.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/11A5W2jVj6Ut4a_xTL7ltTIQ1UDT2G7_E/view	f7ddc6e7-ffa6-46bc-89b6-9ceca67a2058	2025-11-24 15:20:34.445	2025-11-25 10:13:59.062	\N	5
6e5c1122-2e97-4af4-a115-5e14209d937d	Day 7 chaitra 13.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1sLWmx5cXc89gsgeYWac2eUSew6R5qjZA/view	f7ddc6e7-ffa6-46bc-89b6-9ceca67a2058	2025-11-24 15:20:34.446	2025-11-25 10:13:59.062	\N	6
8ce58818-89ec-4d28-8b1c-73a7b501fb24	Restucturing (1)_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1Wt44uES92BMeA-2IsPplp1hP5ZOnBuH2/view	6b79750e-45d4-49c2-8a0a-22759655be40	2025-11-24 15:20:34.169	2025-11-25 10:05:48.242	\N	0
09945c37-1c20-40e7-99bf-d7d4eee08d98	Chapter 4. Project Control Cycle (1)_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1w5JHNNltumTAbsaAr93lQwZJ1g2_shPN/view	6b79750e-45d4-49c2-8a0a-22759655be40	2025-11-24 15:20:34.184	2025-11-25 10:05:48.242	\N	10
8e59c651-dd19-412e-b70e-49b059e0640c	Day 1 poush 2.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1ii1-uhW_WxKePEASCf2l96ljpto9sjjF/view	68da139c-2869-40a5-b3f4-1ba629ee48c9	2025-11-24 15:20:34.286	2025-11-24 15:40:57.832	\N	0
dfbc4bb7-91fd-434c-a260-d0375fb78391	Day 2 poush 3.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1tT9HtXzn-tc0GKJDpsgrmETv5a9MHW92/view	68da139c-2869-40a5-b3f4-1ba629ee48c9	2025-11-24 15:20:34.296	2025-11-24 15:40:57.832	\N	1
67872cda-5583-40e8-ad04-afacbcc38472	Chapter 4. Project Monitoring And Control (1)_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1EXXmh622wjkaclB0OEVONhsn71XIEm45/view	6b79750e-45d4-49c2-8a0a-22759655be40	2025-11-24 15:20:34.184	2025-11-25 10:05:48.242	\N	11
120148a0-363f-4a5e-86f7-f32340ab6bf4	Day 8 chaitra 14.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1MmXbGrI4ztQ7kRdlWYkF2Up-K1oj1UtI/view	f7ddc6e7-ffa6-46bc-89b6-9ceca67a2058	2025-11-24 15:20:34.447	2025-11-25 10:13:59.062	\N	7
5ee50359-7d3f-47ff-8419-356c1425c60b	Day 9 chaitra 15.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1pQeBM3NLLFTlFasP_Luz_5DGaseLcIVG/view	f7ddc6e7-ffa6-46bc-89b6-9ceca67a2058	2025-11-24 15:20:34.448	2025-11-25 10:13:59.062	\N	8
a511b319-731c-4b3f-b98f-749baa0b5c23	Day 9 posh 12.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1e_IAj6v1Ali5cqoYJOqk3wkdY_zZB2q_/view	68da139c-2869-40a5-b3f4-1ba629ee48c9	2025-11-24 15:20:34.305	2025-11-24 15:40:57.832	\N	8
bdf8d4a0-63bc-40e9-b152-387e5804cd35	Day 10 poush 14.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1PC66Xxx7rX15ECqNanHG4amU-ka-5WAO/view	68da139c-2869-40a5-b3f4-1ba629ee48c9	2025-11-24 15:20:34.287	2025-11-24 15:40:57.832	\N	9
abd7ea2e-92ea-46ce-bbbe-a8faf5f65ffc	Day 11  poush 15.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1kKwcFfemnDjgiXzCvnShCR51dUO_hJRu/view	68da139c-2869-40a5-b3f4-1ba629ee48c9	2025-11-24 15:20:34.288	2025-11-24 15:40:57.832	\N	10
6b66624b-2c91-4cfa-bd5b-6bf20ff0cec4	2. भ्रष्टाचार-निवारण-ऐन-२०५९_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1MzPkJ5jXK7vnGRUOh-NvwAhVSJKk8_Ue/view	94af0919-344e-4030-b375-0315c5cd4d9f	2025-11-24 15:20:34.143	2025-11-25 10:04:58.884	\N	3
bbf9cc72-4df5-49fb-ae51-b4c91ab15ade	3. Public_Procurement_Act_2063_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1nXRLxhxpJK6wgA_Z5Vr-qIAWpFDRcQi_/view	94af0919-344e-4030-b375-0315c5cd4d9f	2025-11-24 15:20:34.144	2025-11-25 10:04:58.884	\N	4
90ce3e64-e0dc-4b44-836e-cf53d0782299	4. जग्गा-प्राप्ति-ऐन-२०३४_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1mn3nKUpOLYP6Po2gZib3Jz5uhz5d7cIs/view	94af0919-344e-4030-b375-0315c5cd4d9f	2025-11-24 15:20:34.145	2025-11-25 10:04:58.884	\N	5
fe70ca06-05ac-476f-8d3d-4b2c86f43855	5. वातावरण संरक्षण ऐन २०७६_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1nu2T8x_ATdM73KhJPy3-Ex9WVcYN2myQ/view	94af0919-344e-4030-b375-0315c5cd4d9f	2025-11-24 15:20:34.145	2025-11-25 10:04:58.884	\N	6
313e3770-0218-4ee4-b35e-ffa590a4758c	6. वातावरण-संरक्षण-नियमावली-२०७७-1-39756_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1Xlau-csBkp6EydDygwav55Yve6B3737V/view	94af0919-344e-4030-b375-0315c5cd4d9f	2025-11-24 15:20:34.146	2025-11-25 10:04:58.884	\N	7
b349e421-58a2-4587-b230-c1680fde8886	8. नेपालको-संविधान-2072.pdf	\N	PDF	https://drive.google.com/file/d/1vrfjx2c8QIAQ4gI8IT0QA-WvMf2YTCmx/view	94af0919-344e-4030-b375-0315c5cd4d9f	2025-11-24 15:20:34.147	2025-11-25 10:04:58.884	\N	8
50c848ca-c07c-4f51-b1fb-cd79e0439750	Chapter 2. Important Topics_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1OHkKgmkuZoSTryuxc5kYFrM4LmgzLi9n/view	94af0919-344e-4030-b375-0315c5cd4d9f	2025-11-24 15:20:34.148	2025-11-25 10:04:58.884	\N	9
aec63647-d0d0-469b-906b-c7da41ad478e	Chapter 3. Important Topics_watermark.pdf	\N	PDF	https://drive.google.com/file/d/10VWBRiuTYaEriL4kW2DmCgjt_icL1QmH/view	94af0919-344e-4030-b375-0315c5cd4d9f	2025-11-24 15:20:34.149	2025-11-25 10:04:58.884	\N	10
18a886c3-f513-4702-b282-1c7549e10236	Chapter 4. Concept of Management_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1F4ELZwi58MWtJb6RS9AEp-b-oPhHmw0U/view	94af0919-344e-4030-b375-0315c5cd4d9f	2025-11-24 15:20:34.15	2025-11-25 10:04:58.884	\N	11
8e82c3bf-0a4f-4037-bef2-3ba734265bfd	Chapter 4. Corporate Social Responsibility_watermark.pdf	\N	PDF	https://drive.google.com/file/d/15yXYh0-d8B5V79idl4P2zE66OaY5lXfQ/view	94af0919-344e-4030-b375-0315c5cd4d9f	2025-11-24 15:20:34.161	2025-11-25 10:04:58.884	\N	12
3b0efe41-8d08-48db-8ed6-902cefdf0222	Chapter 4. CPM and PERT_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1zN3upTnI62Sgrf-NsqqowUm9qgA_71DG/view	94af0919-344e-4030-b375-0315c5cd4d9f	2025-11-24 15:20:34.15	2025-11-25 10:04:58.884	\N	13
dd02e99a-a11d-4153-9ccc-c80bb18b86e1	Chapter 4. Decision Making_watermark.pdf	\N	PDF	https://drive.google.com/file/d/14OPovHoI-chMDj9uTTbr7Z2E2aFJRw20/view	94af0919-344e-4030-b375-0315c5cd4d9f	2025-11-24 15:20:34.162	2025-11-25 10:04:58.884	\N	14
076f3152-21a4-4747-8e57-13308032adf0	Chapter 4. Human Resource Planning_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1v_tjHfG0yQLUJgydNk3LidCR7z3mpi2B/view	94af0919-344e-4030-b375-0315c5cd4d9f	2025-11-24 15:20:34.163	2025-11-25 10:04:58.884	\N	15
66d16ce3-bbfd-47f3-ba63-bc69d5ac1c61	Chapter 4. Motivation_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1B3jEcRU__csTwzY-ETMurc1fHSQa6MAl/view	94af0919-344e-4030-b375-0315c5cd4d9f	2025-11-24 15:20:34.164	2025-11-25 10:04:58.884	\N	16
a551db3b-c1de-4710-b18a-66d8cd2449ef	Chapter 4. Project Control Cycle_watermark (1).pdf	\N	PDF	https://drive.google.com/file/d/1IXaK5dn49G866rYTMsOB4s1dy-4UpgN-/view	94af0919-344e-4030-b375-0315c5cd4d9f	2025-11-24 15:20:34.165	2025-11-25 10:04:58.884	\N	17
b3728162-6f61-47e9-88b2-d696705d916c	Chapter 4. Tariff Structure_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1p476xb1m_zsnpnEjj4GiiLje3rbBqO7i/view	94af0919-344e-4030-b375-0315c5cd4d9f	2025-11-24 15:20:34.166	2025-11-25 10:04:58.884	\N	18
a6e460c2-9430-4bdb-bec3-19e19ffb4994	Chapter 5. Features of Nepalese Transmission System_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1M1t_OaXCBzg8GC5dCvi-DJDywvY9BeBt/view	94af0919-344e-4030-b375-0315c5cd4d9f	2025-11-24 15:20:34.167	2025-11-25 10:04:58.884	\N	19
51d4385f-767d-40a2-a515-86f67c82507b	Day 7 Poush 9.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1VFjnNPvsEFH_3cfvPOccnJA-JbNB7AGY/view	68da139c-2869-40a5-b3f4-1ba629ee48c9	2025-11-24 15:20:34.303	2025-11-24 15:40:57.832	\N	6
d5bbeef4-5aa1-4db9-90bc-4c893fdc1fd2	Day 8 poush 10.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1y8R08ZM-LjWDHWFHKuyTJQfdZaeyqIwi/view	68da139c-2869-40a5-b3f4-1ba629ee48c9	2025-11-24 15:20:34.304	2025-11-24 15:40:57.832	\N	7
18414bd8-cd83-469c-af51-faf9062c0c7a	Chapter 5. Important Topics_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1IRbyhTZzH305MHDqiWZ_pBDlwUFkBqhJ/view	94af0919-344e-4030-b375-0315c5cd4d9f	2025-11-24 15:20:34.167	2025-11-25 10:04:58.884	\N	20
42b20542-3f92-40f8-a5cb-ac177ed593a6	Chapter 5. New Trends (1)_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1sM2Gc74yc77g043D9ZF0bc7v_DgyOyi6/view	94af0919-344e-4030-b375-0315c5cd4d9f	2025-11-24 15:20:34.168	2025-11-25 10:04:58.884	\N	21
43f7a8d3-283f-46f1-a82c-360134284679	Chapter 4. Corporate Planning and Strategic Management (1)_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1Wd2En-wMJ27NXSF0FPv5ZWnDXGnGveEg/view	6b79750e-45d4-49c2-8a0a-22759655be40	2025-11-24 15:20:34.176	2025-11-25 10:05:48.242	\N	2
5e4a99a7-a2d9-410a-82a9-db8e6f0c17d7	Chapter 4. Control, Coordination, Teamwork in Management (1)_watermark (1).pdf	\N	PDF	https://drive.google.com/file/d/12PS_F-PhHIfgNTdRybLJtJGGb9r6Z0zd/view	6b79750e-45d4-49c2-8a0a-22759655be40	2025-11-24 15:20:34.175	2025-11-25 10:05:48.242	\N	3
21d737dc-853c-4b80-ad56-c8b5c94d262d	Chapter 4. Corporate Social Responsibility (2)_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1jCFd4764phMox-yuqHiqCMcuBCFh9OzY/view	6b79750e-45d4-49c2-8a0a-22759655be40	2025-11-24 15:20:34.18	2025-11-25 10:05:48.242	\N	4
5fed3edf-9703-4d7b-9af8-9a3db071c5df	Chapter 4. CPM and PERT (1)_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1Cwq598VC41_JpUPdhhmwey5xaqXjJcR4/view	6b79750e-45d4-49c2-8a0a-22759655be40	2025-11-24 15:20:34.172	2025-11-25 10:05:48.242	\N	5
28329af3-1581-41cb-9a50-9e9dcb5e373b	Chapter 4. Decision Making (1)_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1_3HMNmQUeJ8qIPJSzRVDTeb_2QeGvMv7/view	6b79750e-45d4-49c2-8a0a-22759655be40	2025-11-24 15:20:34.181	2025-11-25 10:05:48.242	\N	6
08c2eeee-cacb-4fce-8014-0a0cb86601f4	Chapter 4. Human Resource Planning (1)_watermark.pdf	\N	PDF	https://drive.google.com/file/d/11RdVeNHWQug4cwkttPEDlEJC2Y2MRqel/view	6b79750e-45d4-49c2-8a0a-22759655be40	2025-11-24 15:20:34.181	2025-11-25 10:05:48.242	\N	7
a0d2fd1d-32fa-4640-a67b-f278c10e6c3d	Chapter 4. Leadership (1)_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1W_ItnRBJcRTCCtZF-5gcDDzeeHHluyY4/view	6b79750e-45d4-49c2-8a0a-22759655be40	2025-11-24 15:20:34.182	2025-11-25 10:05:48.242	\N	8
429a6abb-1997-4959-8ce8-d7d867ce3598	Chapter 4. Motivation (1)_watermark.pdf	\N	PDF	https://drive.google.com/file/d/1a4JZv5CTuAqwlHEJSEjf09TA48HhBykm/view	6b79750e-45d4-49c2-8a0a-22759655be40	2025-11-24 15:20:34.183	2025-11-25 10:05:48.242	\N	9
99c0fd84-f87e-40c0-91a9-d472626c2e69	Day 3 magh 10 .mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1xbuG_CW7Sjd37ducI_tqt8QK1R46976L/view	4d08317e-614a-4e8e-a180-b68d722cb809	2025-11-24 15:20:34.274	2025-11-25 10:07:14.83	\N	2
1e48ab86-7cae-47f0-8f43-5a9e6bc1728a	Day 4 magh 13.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1KSRqmEnwXXqZs4djfNOSRiqyflf18jw-/view	4d08317e-614a-4e8e-a180-b68d722cb809	2025-11-24 15:20:34.276	2025-11-25 10:07:14.83	\N	3
3697b50c-c33b-4ca6-8911-aa153cd58d7b	Day 5 magh 14.mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1FTEIDO2eB74CR--oc5ePYfYJLTfWL2aO/view	4d08317e-614a-4e8e-a180-b68d722cb809	2025-11-24 15:20:34.279	2025-11-25 10:07:14.83	\N	4
51394647-fe6f-446c-a795-82dd7989a976	Day 6 magh 15 .mp4.mp4	\N	VIDEO	https://drive.google.com/file/d/1dyae4xbhH67nQLXGWtei08kVY3MI3mEd/view	4d08317e-614a-4e8e-a180-b68d722cb809	2025-11-24 15:20:34.28	2025-11-25 10:07:14.83	\N	5
\.


--
-- Data for Name: FileProgress; Type: TABLE DATA; Schema: public; Owner: edu_user
--

COPY public."FileProgress" (id, "userId", "fileId", completed, "updatedAt", "lastOpenedAt") FROM stdin;
0a5373d5-ce17-4114-be03-6f20b9a973a2	bf28bad8-7623-47d8-a05c-557ff8934212	429a6abb-1997-4959-8ce8-d7d867ce3598	t	2025-11-25 02:31:16.985	2025-11-25 02:31:16.984
adf28301-c394-4e46-af28-97da1f88d26c	bf28bad8-7623-47d8-a05c-557ff8934212	595828fe-1e0b-4551-b0ea-acad3f378d2c	f	2025-11-25 03:29:18.65	2025-11-25 03:29:18.649
201e8b66-83f4-4de7-8c81-3fe32aebc987	bf28bad8-7623-47d8-a05c-557ff8934212	0b105a69-3350-493e-965a-7f36e8f846b9	t	2025-11-25 03:53:51.364	2025-11-25 03:53:51.363
94465e6f-997d-464c-abe8-39090c3a9342	bf28bad8-7623-47d8-a05c-557ff8934212	1c2e2b96-2c0a-4e30-adae-41afc7b995b4	f	2025-11-24 16:13:42.141	2025-11-24 16:13:42.14
12551059-dcd7-43ba-b5c5-acac97b953c7	bf28bad8-7623-47d8-a05c-557ff8934212	0f550ae0-af2a-4c7b-bc1a-e950cd55870a	f	2025-11-24 16:13:42.894	2025-11-24 16:13:42.894
3306cc21-7bb7-45ce-a033-fe4df69c9f66	bf28bad8-7623-47d8-a05c-557ff8934212	9f4e8a42-d253-4c1b-9757-d629a4fd842f	f	2025-11-24 16:13:43.428	2025-11-24 16:13:43.427
d66306a0-c613-41bb-b53f-707df89d00e8	bf28bad8-7623-47d8-a05c-557ff8934212	35aadbef-e90c-41f6-9fef-23f62aa4bf5e	f	2025-11-24 16:13:43.865	2025-11-24 16:13:43.864
f42d2015-0c11-4376-86d2-004cd7828ce0	bf28bad8-7623-47d8-a05c-557ff8934212	554a0354-2f85-470c-8ae1-d8506ed949e3	f	2025-11-24 16:13:44.439	2025-11-24 16:13:44.438
c586b4ea-6659-4bde-aec9-9e4f432d1cc5	bf28bad8-7623-47d8-a05c-557ff8934212	cd0eb713-3b94-4aef-9fe4-1843ed763593	f	2025-11-24 16:13:45.504	2025-11-24 16:13:45.503
4ed885bc-5fe4-4bb5-a19b-7b75410db5c5	bf28bad8-7623-47d8-a05c-557ff8934212	0ba8fbd1-86b7-4d72-9711-9ae75a6961c8	f	2025-11-25 10:34:52.594	2025-11-25 10:34:52.592
7dedd937-d694-48b4-aee2-810ca52d2eed	bf28bad8-7623-47d8-a05c-557ff8934212	7814dce9-eb11-47db-a7b5-9f22b2fb99be	f	2025-11-24 16:13:47.193	2025-11-24 16:13:47.192
893fd5ab-ef61-4844-91ac-463021a0f83d	bf28bad8-7623-47d8-a05c-557ff8934212	01485f42-2d0b-4bab-80f7-0ab16e9ccbaf	f	2025-11-24 16:27:05.632	2025-11-24 16:27:05.631
fc102bcb-26db-479d-920e-c855da11d0af	bf28bad8-7623-47d8-a05c-557ff8934212	8f067783-3341-4f09-858a-3ef23442ea9e	f	2025-11-24 16:27:30.405	2025-11-24 16:27:30.404
9a010d67-3937-4cc8-ac0a-e34ac9100715	bf28bad8-7623-47d8-a05c-557ff8934212	c89e1041-0ebd-4882-8cfa-29189bb260e9	f	2025-11-24 16:27:31.37	2025-11-24 16:27:31.37
1ed375f3-e123-40b7-a236-cc10d714f960	bf28bad8-7623-47d8-a05c-557ff8934212	854d80df-f633-4fe1-8040-5f6f7072ebf0	f	2025-11-24 17:51:16.363	2025-11-24 17:51:16.362
10b346c1-fa6c-4c4f-ab35-038ee9e3642b	bf28bad8-7623-47d8-a05c-557ff8934212	299bcdee-07f5-4a66-84e0-4e7564ec2b58	t	2025-11-25 05:11:50.641	2025-11-25 05:11:50.639
dab3a6d5-fce3-4d30-919c-5ca68c17d59b	bf28bad8-7623-47d8-a05c-557ff8934212	53387f4a-9ac5-4425-9ec6-875473aacf8c	f	2025-11-25 01:33:06.242	2025-11-25 01:33:06.241
69770ec4-49f6-4de3-bdf1-431827b55035	bf28bad8-7623-47d8-a05c-557ff8934212	94d578a2-7228-4219-9c20-b6782a643c65	t	2025-11-25 01:33:10.145	2025-11-25 01:33:10.144
025d72df-3a1b-4e77-af20-f9a9e615d923	bf28bad8-7623-47d8-a05c-557ff8934212	4713a5a8-d017-4512-a81d-2e6b7fb35e0f	t	2025-11-24 16:15:28.831	2025-11-24 16:15:28.83
b814f19d-53dd-4e47-9f52-a218c2702a7f	bf28bad8-7623-47d8-a05c-557ff8934212	d666e925-e367-495c-a7a2-739b34545bad	t	2025-11-24 16:15:39.029	2025-11-24 16:15:39.028
f048d2b1-f10d-4073-94e2-e6de62965151	bf28bad8-7623-47d8-a05c-557ff8934212	267c0c97-14e9-480b-8606-abc7b3d91dd2	t	2025-11-24 16:15:40.87	2025-11-24 16:15:40.869
5ab8735a-f827-4a74-bbd1-a465f684d7fc	bf28bad8-7623-47d8-a05c-557ff8934212	5467aa10-5cd4-4331-b281-3fe25c1575d4	t	2025-11-25 07:35:37.195	2025-11-25 07:35:37.19
732f3f81-3764-4ac8-91b6-bbf80bdc9659	bf28bad8-7623-47d8-a05c-557ff8934212	108012b7-2219-459c-aeb0-80dfbde8e6b6	t	2025-11-25 07:38:04.752	2025-11-25 07:38:04.749
ca0b806a-80f9-4716-8d44-1b9fb54a4145	bf28bad8-7623-47d8-a05c-557ff8934212	ede2304e-d2c9-474f-a810-735dddbfc526	t	2025-11-24 16:16:04.536	2025-11-24 16:16:04.535
b86a4467-ef1d-420b-88bd-b8638070b232	bf28bad8-7623-47d8-a05c-557ff8934212	dd2e090a-edcf-4d3d-9fbd-b07376db66b9	t	2025-11-24 16:16:07.405	2025-11-24 16:16:07.404
3fa9ef3c-5de9-4baa-8968-b8b23135f558	bf28bad8-7623-47d8-a05c-557ff8934212	717b67a7-fd2c-4485-a950-dfdfc6496e72	t	2025-11-24 16:16:09.247	2025-11-24 16:16:09.246
fdd31587-75e1-4286-85a4-9fbdfa558ba1	bf28bad8-7623-47d8-a05c-557ff8934212	75d108ad-c7ad-400b-baa2-f20989ba2230	t	2025-11-24 16:16:53.766	2025-11-24 16:16:53.766
7dab2f6e-5c90-42b3-8f1b-12e14db1bfc4	bf28bad8-7623-47d8-a05c-557ff8934212	8e59c651-dd19-412e-b70e-49b059e0640c	t	2025-11-25 01:33:13.485	2025-11-25 01:33:13.483
9cf1c508-601b-4286-ba8c-af9d9298ff6c	bf28bad8-7623-47d8-a05c-557ff8934212	1e7f51dd-94af-41ba-add6-549c76b29482	t	2025-11-25 02:30:53.465	2025-11-25 02:30:53.464
f1e6b07b-5526-4a7b-a9e3-35f3e45fe301	bf28bad8-7623-47d8-a05c-557ff8934212	43f7a8d3-283f-46f1-a82c-360134284679	t	2025-11-25 02:30:56.618	2025-11-25 02:30:56.617
cc11b6ba-3762-4b86-8f61-32ed465b582d	bf28bad8-7623-47d8-a05c-557ff8934212	5e4a99a7-a2d9-410a-82a9-db8e6f0c17d7	t	2025-11-25 02:30:58.505	2025-11-25 02:30:58.503
3a96f181-13cb-48cd-82a4-01d933f42216	bf28bad8-7623-47d8-a05c-557ff8934212	21d737dc-853c-4b80-ad56-c8b5c94d262d	t	2025-11-25 02:30:59.998	2025-11-25 02:30:59.997
92d9ef88-8821-4f01-8bd9-6e906430f893	bf28bad8-7623-47d8-a05c-557ff8934212	5fed3edf-9703-4d7b-9af8-9a3db071c5df	t	2025-11-25 02:31:01.482	2025-11-25 02:31:01.481
2897fa37-a924-4645-aa6e-074f7d03e9a7	bf28bad8-7623-47d8-a05c-557ff8934212	a0d2fd1d-32fa-4640-a67b-f278c10e6c3d	t	2025-11-25 02:31:04.416	2025-11-25 02:31:04.415
43a06de4-e21f-4f84-817f-18098122019b	bf28bad8-7623-47d8-a05c-557ff8934212	28329af3-1581-41cb-9a50-9e9dcb5e373b	t	2025-11-25 02:31:06.187	2025-11-25 02:31:06.186
d0e2be60-8d9a-45cd-8182-72588de531fd	bf28bad8-7623-47d8-a05c-557ff8934212	08c2eeee-cacb-4fce-8014-0a0cb86601f4	t	2025-11-25 02:31:08.12	2025-11-25 02:31:08.119
aeb5070e-34b1-4c5b-a65b-e1b345aab81e	bf28bad8-7623-47d8-a05c-557ff8934212	67872cda-5583-40e8-ad04-afacbcc38472	t	2025-11-25 02:31:12.095	2025-11-25 02:31:12.094
9c375715-6845-42e9-aef5-841a89f0614b	bf28bad8-7623-47d8-a05c-557ff8934212	09945c37-1c20-40e7-99bf-d7d4eee08d98	t	2025-11-25 02:31:15.365	2025-11-25 02:31:15.364
457af588-3fc7-4226-bb4e-c158f51e941a	bf28bad8-7623-47d8-a05c-557ff8934212	48168ccb-33c2-441c-b61d-2e894fec26da	t	2025-11-25 03:39:03.978	2025-11-25 03:39:03.977
9b5cb6fb-a612-4994-bd70-f98a94e3bf0a	bf28bad8-7623-47d8-a05c-557ff8934212	35f59ea1-438e-4b37-829a-e12fda384d5b	t	2025-11-25 03:52:38.756	2025-11-25 03:52:38.754
3b9ae183-a45a-4f8c-b790-a23abf53b36f	bf28bad8-7623-47d8-a05c-557ff8934212	57ad60a2-df4d-4511-93ac-4508f615d7bf	f	2025-11-25 03:40:33.657	2025-11-25 03:40:33.655
b9afe2d0-092d-440a-9f1a-61c0d02a72bb	bf28bad8-7623-47d8-a05c-557ff8934212	97d49e2d-0c91-4278-bb61-75bb7ca99b67	f	2025-11-25 03:43:44.879	2025-11-25 03:43:44.878
087ee240-9939-420e-83a6-78d744c76f67	bf28bad8-7623-47d8-a05c-557ff8934212	56c3a6fc-358c-4798-b03e-cbc11b2c81ea	f	2025-11-25 03:44:49.946	2025-11-25 03:44:49.944
2b4b2176-3b73-4b10-992a-fb41ecc0342e	bf28bad8-7623-47d8-a05c-557ff8934212	60c8c9f6-16d0-494a-ab0e-271027284654	f	2025-11-25 03:48:39.304	2025-11-25 03:48:39.303
85bd288e-882f-407e-869f-5c8d0a61b615	bf28bad8-7623-47d8-a05c-557ff8934212	89c967c2-a71e-4973-9fd0-5ea90a2ac839	f	2025-11-25 05:12:39.447	2025-11-25 05:12:39.446
04753d74-fec2-4351-a31d-6f67a461335f	bf28bad8-7623-47d8-a05c-557ff8934212	9aa955a8-ee86-45e2-9350-a0f09d99d2f5	t	2025-11-25 07:33:28.176	2025-11-25 07:33:28.175
3630150d-5b80-494f-beec-9f531c06a99f	bf28bad8-7623-47d8-a05c-557ff8934212	d5bbeef4-5aa1-4db9-90bc-4c893fdc1fd2	t	2025-11-25 07:38:07.142	2025-11-25 07:38:07.141
9d210aeb-5ce5-4112-af6a-fd3ff6ace7be	bf28bad8-7623-47d8-a05c-557ff8934212	51d4385f-767d-40a2-a515-86f67c82507b	t	2025-11-25 07:38:09.132	2025-11-25 07:38:09.131
bb9d407d-b05a-4978-aea0-2165058adbfa	bf28bad8-7623-47d8-a05c-557ff8934212	a5043fe0-7cdd-4d12-83af-ed4f187a344e	t	2025-11-25 07:38:10.534	2025-11-25 07:38:10.533
41005737-4044-445b-b4e3-da50de6a15d0	bf28bad8-7623-47d8-a05c-557ff8934212	25b80f31-a761-4cb6-8396-f3636b28b7fd	f	2025-11-25 10:28:38.986	2025-11-25 10:28:38.984
7ca3f671-b20a-4caf-b2a0-4dbc2acd70d9	bf28bad8-7623-47d8-a05c-557ff8934212	dfbc4bb7-91fd-434c-a260-d0375fb78391	f	2025-11-25 07:38:13.146	2025-11-25 07:38:13.145
47d83d53-e844-429f-9284-8e97d4282ce9	bf28bad8-7623-47d8-a05c-557ff8934212	8be1d29a-2d07-442e-8c61-dd11ac5ac034	t	2025-11-25 07:38:15.877	2025-11-25 07:38:15.877
60a229be-8977-4dc0-bc52-602fead82371	bf28bad8-7623-47d8-a05c-557ff8934212	4e8aa96e-3d1f-48e9-8d08-8ff56779ef7e	t	2025-11-25 10:29:33.113	2025-11-25 10:29:33.112
\.


--
-- Data for Name: Folder; Type: TABLE DATA; Schema: public; Owner: edu_user
--

COPY public."Folder" (id, name, description, "parentId", "createdAt", "updatedAt", "createdById", "order") FROM stdin;
7b5472a7-2dff-4239-88c8-bff06fdf4bfc	Notes	\N	0c5c8eff-19bc-427b-ba83-76899cf5a6f0	2025-11-24 15:20:34.128	2025-11-24 15:20:34.128	\N	0
9ef9c9dc-0bc5-4b1e-8610-8b1226238872	GK	\N	7b5472a7-2dff-4239-88c8-bff06fdf4bfc	2025-11-24 15:20:34.129	2025-11-24 15:20:34.129	\N	0
1778170d-5d75-4288-b406-eb6e4bc9a746	IQ	\N	7b5472a7-2dff-4239-88c8-bff06fdf4bfc	2025-11-24 15:20:34.136	2025-11-24 15:20:34.136	\N	0
94af0919-344e-4030-b375-0315c5cd4d9f	खण्ड ख	\N	7b5472a7-2dff-4239-88c8-bff06fdf4bfc	2025-11-24 15:20:34.139	2025-11-24 15:20:34.139	\N	0
6b79750e-45d4-49c2-8a0a-22759655be40	chapter 4 management	\N	94af0919-344e-4030-b375-0315c5cd4d9f	2025-11-24 15:20:34.171	2025-11-24 15:20:34.171	\N	0
1e4526bd-28ab-4e50-b7d4-f61672769619	Old Questions	\N	0c5c8eff-19bc-427b-ba83-76899cf5a6f0	2025-11-24 15:20:34.194	2025-11-24 15:20:34.194	\N	0
fa99e264-4f19-4156-a9b6-84eeb2e2f072	videos	\N	0c5c8eff-19bc-427b-ba83-76899cf5a6f0	2025-11-24 15:20:34.198	2025-11-24 15:20:34.198	\N	0
4d08317e-614a-4e8e-a180-b68d722cb809	GK	\N	fa99e264-4f19-4156-a9b6-84eeb2e2f072	2025-11-24 15:20:34.203	2025-11-24 15:20:34.203	\N	0
68da139c-2869-40a5-b3f4-1ba629ee48c9	IQ	\N	fa99e264-4f19-4156-a9b6-84eeb2e2f072	2025-11-24 15:20:34.285	2025-11-24 15:20:34.285	\N	0
2a678b73-6f70-4577-9205-c24491cdbecf	Khanda Kha	\N	fa99e264-4f19-4156-a9b6-84eeb2e2f072	2025-11-24 15:20:34.306	2025-11-24 15:20:34.306	\N	0
c6c1563f-1c23-4183-a531-ec1bf05c640c	Notes	\N	79a2bd95-4735-4701-8c0a-e18f67c524b7	2025-11-24 15:20:34.331	2025-11-24 15:20:34.331	\N	0
c2f96650-3e67-45a8-927b-a0eed5ccfb35	Videos	\N	79a2bd95-4735-4701-8c0a-e18f67c524b7	2025-11-24 15:20:34.399	2025-11-24 15:20:34.399	\N	0
1a378efa-dba8-45ad-ab62-3ea212a47338	2.Electrical Machines	\N	c6c1563f-1c23-4183-a531-ec1bf05c640c	2025-11-24 15:20:34.358	2025-11-25 10:09:48.114	\N	1
573acc82-fd65-4434-b134-3985a902b907	4.Transmission and Distribution	\N	c6c1563f-1c23-4183-a531-ec1bf05c640c	2025-11-24 15:20:34.367	2025-11-25 10:09:48.114	\N	2
b7eeeafa-ad40-468f-8e06-c2ad6d865b1a	5.Power System Analysis	\N	c6c1563f-1c23-4183-a531-ec1bf05c640c	2025-11-24 15:20:34.381	2025-11-25 10:09:48.114	\N	3
4efa5a9e-8f60-4a0b-a3e1-3676340f2f15	10. Safety Engineering	\N	c6c1563f-1c23-4183-a531-ec1bf05c640c	2025-11-24 15:20:34.343	2025-11-25 10:09:48.114	\N	4
39ca2d2e-876d-41e0-af9e-97a0a08da1c8	11.Instrumentation and Control	\N	c6c1563f-1c23-4183-a531-ec1bf05c640c	2025-11-24 15:20:34.346	2025-11-25 10:09:48.114	\N	5
9ceea9d2-c954-490d-8ea6-359d76dc10f5	12.standard	\N	c6c1563f-1c23-4183-a531-ec1bf05c640c	2025-11-24 15:20:34.351	2025-11-25 10:09:48.114	\N	6
ae3b2426-d083-43fd-8568-d58e230597db	1.Electrical Engineering Fundamentals	\N	c2f96650-3e67-45a8-927b-a0eed5ccfb35	2025-11-24 15:20:34.4	2025-11-25 10:11:09.362	\N	0
2d11121c-1cd5-4ca5-a0c9-738825de8cfa	2.Electrical Machines	\N	c2f96650-3e67-45a8-927b-a0eed5ccfb35	2025-11-24 15:20:34.408	2025-11-25 10:11:09.362	\N	1
2fdfa191-3b76-4970-881e-e35519ba84ed	3.Power Generation	\N	c2f96650-3e67-45a8-927b-a0eed5ccfb35	2025-11-24 15:20:34.418	2025-11-25 10:11:09.362	\N	2
5a393e23-ce06-463d-85ed-97f1c71444c6	4.Transmission and Distribution	\N	c2f96650-3e67-45a8-927b-a0eed5ccfb35	2025-11-24 15:20:34.422	2025-11-25 10:11:09.362	\N	3
f7ddc6e7-ffa6-46bc-89b6-9ceca67a2058	5.Power System Analysis	\N	c2f96650-3e67-45a8-927b-a0eed5ccfb35	2025-11-24 15:20:34.433	2025-11-25 10:11:09.362	\N	4
63505dc8-883d-4714-844a-20cb0022ef37	6.Power Electronics	\N	c2f96650-3e67-45a8-927b-a0eed5ccfb35	2025-11-24 15:20:34.449	2025-11-25 10:11:09.362	\N	5
05768167-c49e-49ab-b573-d387dce78038	9.Economics of Power Utilization	\N	c2f96650-3e67-45a8-927b-a0eed5ccfb35	2025-11-24 15:20:34.459	2025-11-25 10:11:09.362	\N	6
fe06efbf-8a5d-4967-84a6-623195a7321b	10.Safety Engineering	\N	c2f96650-3e67-45a8-927b-a0eed5ccfb35	2025-11-24 15:20:34.405	2025-11-25 10:11:09.362	\N	7
0c5c8eff-19bc-427b-ba83-76899cf5a6f0	1st papper	\N	\N	2025-11-24 15:20:34.125	2025-11-25 10:30:19.429	\N	0
79a2bd95-4735-4701-8c0a-e18f67c524b7	2nd papper	\N	\N	2025-11-24 15:20:34.331	2025-11-25 10:30:19.429	\N	1
f24c6c6b-c8fc-4e46-a1f3-64647abefd63	1. Fundamentals	\N	c6c1563f-1c23-4183-a531-ec1bf05c640c	2025-11-24 15:20:34.332	2025-11-25 10:09:48.114	\N	0
\.


--
-- Data for Name: MCQQuestion; Type: TABLE DATA; Schema: public; Owner: edu_user
--

COPY public."MCQQuestion" (id, question, "optionA", "optionB", "optionC", "optionD", "correctOption", explanation, "createdAt", "updatedAt") FROM stdin;
90aa28dd-cca2-4b64-a868-f22b04fd9281	what is your name	madhav	neupane	madhav neupane	neupane madhav	C	my nameis madhav neupane	2025-11-25 10:31:09.555	2025-11-25 10:31:09.555
\.


--
-- Data for Name: MediaAsset; Type: TABLE DATA; Schema: public; Owner: edu_user
--

COPY public."MediaAsset" (id, url, label, "createdAt", "createdBy") FROM stdin;
\.


--
-- Data for Name: PasswordResetToken; Type: TABLE DATA; Schema: public; Owner: edu_user
--

COPY public."PasswordResetToken" (id, "tokenHash", "expiresAt", used, "userId", "createdAt") FROM stdin;
\.


--
-- Data for Name: SyllabusSection; Type: TABLE DATA; Schema: public; Owner: edu_user
--

COPY public."SyllabusSection" (id, title, content, "order", "parentId", "folderId", "createdAt", "updatedAt") FROM stdin;
33dcf613-f03e-4010-8990-1675894e4b7d	NEA Level 7 Electrical Engineering Syllabus	नेपाल विद्युत प्राधिकरण प्राविधिक सेवा, तह ७ (इलेक्ट्रिकल) को विस्तृत पाठ्यक्रम।	0	\N	\N	2025-11-25 02:17:37.018	2025-11-25 02:17:37.018
56e58428-7507-4da1-bef2-ccd4ea2aefca	Switchgear and Protection	Relays (electromagnetic/static/digital), protection of generator/transformer/lines; circuit breakers (ACB/OCB/VCB/ABCB/SF6); over-voltage and lightning protection, surge arresters; substations (indoor/outdoor, bus arrangements, earthing).	6	fedeb508-3b78-4ecf-b0cb-2d6f3a87d613	\N	2025-11-25 02:17:37.046	2025-11-25 02:17:37.046
d98332ae-8b45-4004-9c96-a35ff58e16a1	संस्थागत र कानूनी रूपरेखा	नेपालको संविधान, विद्युत ऐन २०४९, नेपाल विद्युत प्राधिकरण ऐन २०४१, विद्युत नियमन आयोग ऐन २०७४, सार्वजनिक खरिद ऐन २०६३, सुशासन ऐन २०६४, जग्गा अधिग्रहण ऐन २०३४, वातावरण संरक्षण ऐन २०७६/नियमावली २०७७, प्राधिकरणको सेवा/वित्तीय नियमावली, भ्रष्टाचार निवारण ऐन २०५९।	1	7951ea5f-1034-4663-95fe-f5b33e0e7860	94af0919-344e-4030-b375-0315c5cd4d9f	2025-11-25 02:17:37.027	2025-11-25 02:19:15.728
4cf0d03c-f460-4ace-848f-fd6c6cc57f6a	विद्युत क्षेत्रका नयाँ प्रवृत्ति	ऊर्जा स्रोतहरू, IPP को भूमिका, PPA/PDA, ऊर्जा बैंकिङ, विनिमय पूल बजार, क्षेत्रीय/उप-क्षेत्रीय ग्रिड अन्तरसम्बन्ध, विश्व र नेपालका हालका प्रवृत्ति।	3	7951ea5f-1034-4663-95fe-f5b33e0e7860	94af0919-344e-4030-b375-0315c5cd4d9f	2025-11-25 02:17:37.031	2025-11-25 02:19:29.427
c78d887e-9db6-4274-a9c7-c1a20c3e55a5	Electrical Machines	Magnetic circuits, hysteresis/eddy losses; Transformers (equivalent circuit, efficiency, regulation, testing, grounding, parallel, auto/instrument); DC machines (types, characteristics, speed control); Synchronous machines (operation, excitation, governor, hunting); Induction machines (motor/generator, starters, speed control, selection).	1	fedeb508-3b78-4ecf-b0cb-2d6f3a87d613	2d11121c-1cd5-4ca5-a0c9-738825de8cfa	2025-11-25 02:17:37.035	2025-11-25 10:12:30.469
fedeb508-3b78-4ecf-b0cb-2d6f3a87d613	द्वितीय पत्र - प्राविधिक विस्तृत ज्ञान	विद्युत इन्जिनियरिङ् आधारभूत, मेसिनहरू, उत्पादन, प्रसारण/वितरण, प्रणाली विश्लेषण, पावर इलेक्ट्रोनिक्स, स्विच्गियर/प्रोटेक्सन, उपभोक्ता सेवा, अर्थशास्त्र, सुरक्षा, इन्स्ट्रुमेन्टेसन/कन्ट्रोल र प्रयोगशाला मानक।	1	33dcf613-f03e-4010-8990-1675894e4b7d	c2f96650-3e67-45a8-927b-a0eed5ccfb35	2025-11-25 02:17:37.032	2025-11-25 10:11:39.65
acdfbf66-596a-4ae1-ac27-a569f49cc9db	Power Electronics	Devices (diode, BJT, MOSFET, thyristor, GTO, IGBT); rectifiers (controlled/uncontrolled), inverters (VSI/CSI), harmonic filtering; choppers, cycloconverters, AC controllers; intro to HVDC.	5	fedeb508-3b78-4ecf-b0cb-2d6f3a87d613	63505dc8-883d-4714-844a-20cb0022ef37	2025-11-25 02:17:37.041	2025-11-25 10:14:45.036
1a56ef1f-ad94-444d-b62b-bb4531575ee2	Power System Analysis	Load flow basics, voltage/frequency balance, VAR compensation, PF improvement; Stability (steady, dynamic, transient, swing equation, equal area); Faults (sym/unsym), protection components; ELDC principles, dispatch tools/benefits; transmission/distribution layout and reliability; supply quality standards.	4	fedeb508-3b78-4ecf-b0cb-2d6f3a87d613	f7ddc6e7-ffa6-46bc-89b6-9ceca67a2058	2025-11-25 02:17:37.039	2025-11-25 10:14:59.166
0db45ffe-9446-4601-8115-3f46de25709c	Transmission and Distribution	Voltage choice, conductor/insulator selection, span/sag-tension, vibration dampers, clearances, towers/ROW; line parameters, ABCD, SIL, Ferranti effect; corona (loss/noise/RI); inductive interference; distribution feeders, substations, bus schemes, PF correction, reactive compensation, reliability indices, oil, metering.	3	fedeb508-3b78-4ecf-b0cb-2d6f3a87d613	5a393e23-ce06-463d-85ed-97f1c71444c6	2025-11-25 02:17:37.037	2025-11-25 10:15:10.216
e3740483-fbe2-41ea-a1ea-96d735e0a220	Power Generation	Hydro plants (site, layout, turbines, alternators, auxiliaries, Nepal plants), Diesel plants, Renewable (micro hydro, solar PV, wind, geothermal, tidal), Generation economics (load curve, demand/plant/use factors, diversity).	2	fedeb508-3b78-4ecf-b0cb-2d6f3a87d613	2fdfa191-3b76-4970-881e-e35519ba84ed	2025-11-25 02:17:37.035	2025-11-25 10:15:37.243
5db5c45b-60b0-4843-8223-77f848df318f	Electrical Engineering Fundamentals	Charge/current, AC/DC, Ohm/Kirchhoff, Star-Delta, Network theorems (Superposition, Thevenin, Norton, Max power), RLC transients, Laplace/Transfer function, three-phase systems, active/reactive power, resonance, operational amplifiers, two-port networks.	0	fedeb508-3b78-4ecf-b0cb-2d6f3a87d613	ae3b2426-d083-43fd-8568-d58e230597db	2025-11-25 02:17:37.033	2025-11-25 10:15:48.582
6de444d8-f39a-4da8-ab8c-6c9c1e8a046a	Power Distribution and Consumer Services	Substation/switchyard layout, underground cables (selection, joints, protection), single-wire distribution, lightning arrestors, earth wire, voltage drop/Ferranti, SIL, earthing methods and importance.	7	fedeb508-3b78-4ecf-b0cb-2d6f3a87d613	\N	2025-11-25 02:17:37.048	2025-11-25 02:17:37.048
4bc0695b-640d-4eee-b5f3-1cdef67c90f9	Instrumentation and Control	Electrical measurements (analog/digital, precision/error), sensors/transducers for speed/position/flow/temp, feedback control (time/frequency response, stability, root locus, bode), PID control, converters (ADC/DAC).	10	fedeb508-3b78-4ecf-b0cb-2d6f3a87d613	\N	2025-11-25 02:17:37.057	2025-11-25 02:17:37.057
f1f55044-4cf6-4695-8994-2e6ab9294e60	Testing Laboratory Standards	Technical standards, accreditation, calibration of testing devices for electrical machines and equipment.	11	fedeb508-3b78-4ecf-b0cb-2d6f3a87d613	\N	2025-11-25 02:17:37.058	2025-11-25 02:17:37.058
5b985ad4-8197-435b-adbf-53ddfefd5493	सामान्य ज्ञान र बौद्धिक परीक्षण	नेपालको भूगोल, जलवायु, नदी/ताल, खनिज, उर्जा, शिक्षा, स्वास्थ्य, सञ्चार; सामाजिक र सांस्कृतिक विविधता; विद्युत विकास र सम्भावना; संघीय संरचना; विश्व भूगोल, महादेश/महासागर, अक्षांश/देशान्तर; SAARC, UNO; समसामयिक घटना; Verbal/Non-verbal aptitude, Numerical ability (Ohm’s law, profit-loss, ratio, percentage, direction, series आदि)।	0	7951ea5f-1034-4663-95fe-f5b33e0e7860	1778170d-5d75-4288-b406-eb6e4bc9a746	2025-11-25 02:17:37.025	2025-11-25 02:19:04.431
239f4665-d661-4a3f-ade7-6c5bc47d8d42	व्यवस्थापन, वित्त र विकास	व्यवस्थापनका आधारभूत सिद्धान्त: Motivation, Leadership, Control, Coordination, Decision making, Strategic Management, Corporate Social Responsibility; परियोजना व्यवस्थापन (CPM/PERT, HR planning, Resource scheduling, Monitoring/Control, Project control cycle); वित्तीय विश्लेषण (B/C, IRR/EIRR/FIRR, NPV, Payback); विद्युत दर संरचना; विकास प्रशासन, PPP, दिगो विकास, योजना निर्माण।	2	7951ea5f-1034-4663-95fe-f5b33e0e7860	94af0919-344e-4030-b375-0315c5cd4d9f	2025-11-25 02:17:37.029	2025-11-25 02:19:24.22
fbd5610a-61b8-4abb-a94e-426497637485	Safety Engineering	Electric shock effects, first aid, safety rules, live-line maintenance precautions, safety tools/standards, earthing/shielding, earth resistance tests, fire hazards and firefighting equipment.	9	fedeb508-3b78-4ecf-b0cb-2d6f3a87d613	fe06efbf-8a5d-4967-84a6-623195a7321b	2025-11-25 02:17:37.056	2025-11-25 10:14:23.409
848c3707-3779-42e2-9912-2cf3170d079f	Economics of Power Utilization	Energy audit basics, load management/DSM, TOD meter, PF improvement methods/benefits, load forecast, demand/load/plant/diversity factors, depreciation, rate of return, tariff structures.	8	fedeb508-3b78-4ecf-b0cb-2d6f3a87d613	05768167-c49e-49ab-b573-d387dce78038	2025-11-25 02:17:37.051	2025-11-25 10:14:36.196
7951ea5f-1034-4663-95fe-f5b33e0e7860	प्रथम पत्र - सामान्य ज्ञान र व्यवस्थापन	सामान्य ज्ञान, भौगोलिक र सामाजिक संरचना, उर्जा विकास, संघीय शासन प्रणाली, अन्तर्राष्ट्रिय संस्था SAARC/UNO, समसामयिक घटना, बौद्धिक परीक्षण (Verbal/Non-verbal), संख्यात्मक क्षमता, तथा प्रशासनिक/संगठन व्यवस्थापनका आधारभूत सिद्धान्तहरू।	0	33dcf613-f03e-4010-8990-1675894e4b7d	9ef9c9dc-0bc5-4b1e-8610-8b1226238872	2025-11-25 02:17:37.022	2025-11-25 10:32:14.646
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: edu_user
--

COPY public."User" (id, name, email, "passwordHash", role, "createdAt", "updatedAt", "isActive", "isApproved", "avatarUrl", phone, "preparingFor", school) FROM stdin;
b9b470c2-5a88-4441-b692-4bd88be07462	Admin	admin@example.com	$2a$10$C6zS/G5jqtbVQYI3rs4QZuUl46hgXOzNV8pCEC3M1CTQ1aewlP9B.	ADMIN	2025-11-24 15:06:58.608	2025-11-24 15:39:18.407	t	t	\N	\N	\N	\N
bf28bad8-7623-47d8-a05c-557ff8934212	Madhav	madhavneupane6789@gmail.com	$2a$10$23ondqon17Dsr0mH9J7emOaTTz0zMQLoFOAb/0u3Hn3XHUJX9ZTtW	USER	2025-11-24 15:15:08.266	2025-11-24 16:05:39.165	t	t	\N	\N	\N	\N
61ce3c1b-57ca-44cb-993e-0731b41eeaff	madhav Neupane	madhavneupane1111@gmail.com	$2a$10$pxtjn.3GoVclWmLWvXHGoutfDB0ym.SPzF8odXSyZAxiJ8RojuxaG	ADMIN	2025-11-24 16:29:47.584	2025-11-24 16:29:47.584	t	t	\N	\N	\N	\N
\.


--
-- Name: Announcement Announcement_pkey; Type: CONSTRAINT; Schema: public; Owner: edu_user
--

ALTER TABLE ONLY public."Announcement"
    ADD CONSTRAINT "Announcement_pkey" PRIMARY KEY (id);


--
-- Name: Bookmark Bookmark_pkey; Type: CONSTRAINT; Schema: public; Owner: edu_user
--

ALTER TABLE ONLY public."Bookmark"
    ADD CONSTRAINT "Bookmark_pkey" PRIMARY KEY (id);


--
-- Name: FileProgress FileProgress_pkey; Type: CONSTRAINT; Schema: public; Owner: edu_user
--

ALTER TABLE ONLY public."FileProgress"
    ADD CONSTRAINT "FileProgress_pkey" PRIMARY KEY (id);


--
-- Name: File File_pkey; Type: CONSTRAINT; Schema: public; Owner: edu_user
--

ALTER TABLE ONLY public."File"
    ADD CONSTRAINT "File_pkey" PRIMARY KEY (id);


--
-- Name: Folder Folder_pkey; Type: CONSTRAINT; Schema: public; Owner: edu_user
--

ALTER TABLE ONLY public."Folder"
    ADD CONSTRAINT "Folder_pkey" PRIMARY KEY (id);


--
-- Name: MCQQuestion MCQQuestion_pkey; Type: CONSTRAINT; Schema: public; Owner: edu_user
--

ALTER TABLE ONLY public."MCQQuestion"
    ADD CONSTRAINT "MCQQuestion_pkey" PRIMARY KEY (id);


--
-- Name: MediaAsset MediaAsset_pkey; Type: CONSTRAINT; Schema: public; Owner: edu_user
--

ALTER TABLE ONLY public."MediaAsset"
    ADD CONSTRAINT "MediaAsset_pkey" PRIMARY KEY (id);


--
-- Name: PasswordResetToken PasswordResetToken_pkey; Type: CONSTRAINT; Schema: public; Owner: edu_user
--

ALTER TABLE ONLY public."PasswordResetToken"
    ADD CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY (id);


--
-- Name: SyllabusSection SyllabusSection_pkey; Type: CONSTRAINT; Schema: public; Owner: edu_user
--

ALTER TABLE ONLY public."SyllabusSection"
    ADD CONSTRAINT "SyllabusSection_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: edu_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Bookmark_userId_fileId_key; Type: INDEX; Schema: public; Owner: edu_user
--

CREATE UNIQUE INDEX "Bookmark_userId_fileId_key" ON public."Bookmark" USING btree ("userId", "fileId");


--
-- Name: FileProgress_userId_fileId_key; Type: INDEX; Schema: public; Owner: edu_user
--

CREATE UNIQUE INDEX "FileProgress_userId_fileId_key" ON public."FileProgress" USING btree ("userId", "fileId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: edu_user
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Bookmark Bookmark_fileId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: edu_user
--

ALTER TABLE ONLY public."Bookmark"
    ADD CONSTRAINT "Bookmark_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES public."File"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Bookmark Bookmark_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: edu_user
--

ALTER TABLE ONLY public."Bookmark"
    ADD CONSTRAINT "Bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: FileProgress FileProgress_fileId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: edu_user
--

ALTER TABLE ONLY public."FileProgress"
    ADD CONSTRAINT "FileProgress_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES public."File"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: FileProgress FileProgress_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: edu_user
--

ALTER TABLE ONLY public."FileProgress"
    ADD CONSTRAINT "FileProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: File File_folderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: edu_user
--

ALTER TABLE ONLY public."File"
    ADD CONSTRAINT "File_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES public."Folder"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: File File_ownerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: edu_user
--

ALTER TABLE ONLY public."File"
    ADD CONSTRAINT "File_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Folder Folder_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: edu_user
--

ALTER TABLE ONLY public."Folder"
    ADD CONSTRAINT "Folder_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Folder Folder_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: edu_user
--

ALTER TABLE ONLY public."Folder"
    ADD CONSTRAINT "Folder_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."Folder"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PasswordResetToken PasswordResetToken_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: edu_user
--

ALTER TABLE ONLY public."PasswordResetToken"
    ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SyllabusSection SyllabusSection_folderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: edu_user
--

ALTER TABLE ONLY public."SyllabusSection"
    ADD CONSTRAINT "SyllabusSection_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES public."Folder"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: SyllabusSection SyllabusSection_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: edu_user
--

ALTER TABLE ONLY public."SyllabusSection"
    ADD CONSTRAINT "SyllabusSection_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."SyllabusSection"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict mcUwkrPyre1syxmJ8p8BtgcEEyjy81W5gWqCYJXh0kcBeKsODZMJj2a2sabMgrH

