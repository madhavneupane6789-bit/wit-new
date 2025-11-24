import { prisma } from '../config/db';
import { FileType } from '@prisma/client';

type Row = {
  level1: string;
  level2: string;
  level3: string;
  level4: string;
  level5: string;
  fileName: string;
  extension: string;
  path: string;
  link: string;
};

// Raw TSV pasted from user (Level1\tLevel2\tLevel3\tLevel4\tLevel5\tFile Name\tType\tExtension\tFull Path\tlink)
const raw = `
1st papper	Notes	GK			uno and saarc _watermark.pdf	File	pdf	1st papper/Notes/GK/	https://drive.google.com/file/d/1rs8olcL-XUwN_eDnkt9zC_HLSMNghQfL/view
1st papper	Notes	GK			जात जाती_watermark.pdf	File	pdf	1st papper/Notes/GK/	https://drive.google.com/file/d/17hUx9sKKrL52uWboWX5zj53aW8zAmFI9/view
1st papper	Notes	GK			नेपालको भूगोल.pdf	File	pdf	1st papper/Notes/GK/	https://drive.google.com/file/d/1lPfs3SuPALenilFee9hbLUavzZniohFU/view
1st papper	Notes	GK			विश्वको भूगोल_watermark.pdf	File	pdf	1st papper/Notes/GK/	https://drive.google.com/file/d/1MD-wunjNNinrgH6DDqdmyRv2klWzDtvh/view
1st papper	Notes	IQ			IQ.pdf	File	pdf	1st papper/Notes/IQ/	https://drive.google.com/file/d/1LoLxtoTFaypCKrJ-XLGB36X7dRv8svTx/view
1st papper	Notes	खण्ड ख			1. Good Governance Act 2064.pdf	File	pdf	1st papper/Notes/खण्ड ख/	https://drive.google.com/file/d/1XYzraEHcc32B2zH6uFmDzYSk7BnGrW5R/view
1st papper	Notes	खण्ड ख			1. Orientation.pdf	File	pdf	1st papper/Notes/खण्ड ख/	https://drive.google.com/file/d/1lNl7AcAZebjCKaDCl-C-Km3UVX7xyF1S/view
1st papper	Notes	खण्ड ख			2. Electricity-Regulatory-Commission-Act-2074.pdf	File	pdf	1st papper/Notes/खण्ड ख/	https://drive.google.com/file/d/1ahaFCVjS9B4mejptvgX68BRPx3hcEcnm/view
1st papper	Notes	खण्ड ख			2. भ्रष्टाचार-निवारण-ऐन-२०५९_watermark.pdf	File	pdf	1st papper/Notes/खण्ड ख/	https://drive.google.com/file/d/1MzPkJ5jXK7vnGRUOh-NvwAhVSJKk8_Ue/view
1st papper	Notes	खण्ड ख			3. Public_Procurement_Act_2063_watermark.pdf	File	pdf	1st papper/Notes/खण्ड ख/	https://drive.google.com/file/d/1nXRLxhxpJK6wgA_Z5Vr-qIAWpFDRcQi_/view
1st papper	Notes	खण्ड ख			4. जग्गा-प्राप्ति-ऐन-२०३४_watermark.pdf	File	pdf	1st papper/Notes/खण्ड ख/	https://drive.google.com/file/d/1mn3nKUpOLYP6Po2gZib3Jz5uhz5d7cIs/view
1st papper	Notes	खण्ड ख			5. वातावरण संरक्षण ऐन २०७६_watermark.pdf	File	pdf	1st papper/Notes/खण्ड ख/	https://drive.google.com/file/d/1nu2T8x_ATdM73KhJPy3-Ex9WVcYN2myQ/view
1st papper	Notes	खण्ड ख			6. वातावरण-संरक्षण-नियमावली-२०७७-1-39756_watermark.pdf	File	pdf	1st papper/Notes/खण्ड ख/	https://drive.google.com/file/d/1Xlau-csBkp6EydDygwav55Yve6B3737V/view
1st papper	Notes	खण्ड ख			8. नेपालको-संविधान-2072.pdf	File	pdf	1st papper/Notes/खण्ड ख/	https://drive.google.com/file/d/1vrfjx2c8QIAQ4gI8IT0QA-WvMf2YTCmx/view
1st papper	Notes	खण्ड ख			Chapter 2. Important Topics_watermark.pdf	File	pdf	1st papper/Notes/खण्ड ख/	https://drive.google.com/file/d/1OHkKgmkuZoSTryuxc5kYFrM4LmgzLi9n/view
1st papper	Notes	खण्ड ख			Chapter 3. Important Topics_watermark.pdf	File	pdf	1st papper/Notes/खण्ड ख/	https://drive.google.com/file/d/10VWBRiuTYaEriL4kW2DmCgjt_icL1QmH/view
1st papper	Notes	खण्ड ख			Chapter 4. CPM and PERT_watermark.pdf	File	pdf	1st papper/Notes/खण्ड ख/	https://drive.google.com/file/d/1zN3upTnI62Sgrf-NsqqowUm9qgA_71DG/view
1st papper	Notes	खण्ड ख			Chapter 4. Concept of Management_watermark.pdf	File	pdf	1st papper/Notes/खण्ड ख/	https://drive.google.com/file/d/1F4ELZwi58MWtJb6RS9AEp-b-oPhHmw0U/view
1st papper	Notes	खण्ड ख			Chapter 4. Corporate Social Responsibility_watermark.pdf	File	pdf	1st papper/Notes/खण्ड ख/	https://drive.google.com/file/d/15yXYh0-d8B5V79idl4P2zE66OaY5lXfQ/view
1st papper	Notes	खण्ड ख			Chapter 4. Decision Making_watermark.pdf	File	pdf	1st papper/Notes/खण्ड ख/	https://drive.google.com/file/d/14OPovHoI-chMDj9uTTbr7Z2E2aFJRw20/view
1st papper	Notes	खण्ड ख			Chapter 4. Human Resource Planning_watermark.pdf	File	pdf	1st papper/Notes/खण्ड ख/	https://drive.google.com/file/d/1v_tjHfG0yQLUJgydNk3LidCR7z3mpi2B/view
1st papper	Notes	खण्ड ख			Chapter 4. Motivation_watermark.pdf	File	pdf	1st papper/Notes/खण्ड ख/	https://drive.google.com/file/d/1B3jEcRU__csTwzY-ETMurc1fHSQa6MAl/view
1st papper	Notes	खण्ड ख			Chapter 4. Project Control Cycle_watermark (1).pdf	File	pdf	1st papper/Notes/खण्ड ख/	https://drive.google.com/file/d/1IXaK5dn49G866rYTMsOB4s1dy-4UpgN-/view
1st papper	Notes	खण्ड ख			Chapter 4. Tariff Structure_watermark.pdf	File	pdf	1st papper/Notes/खण्ड ख/	https://drive.google.com/file/d/1p476xb1m_zsnpnEjj4GiiLje3rbBqO7i/view
1st papper	Notes	खण्ड ख			Chapter 5. Features of Nepalese Transmission System_watermark.pdf	File	pdf	1st papper/Notes/खण्ड ख/	https://drive.google.com/file/d/1M1t_OaXCBzg8GC5dCvi-DJDywvY9BeBt/view
1st papper	Notes	खण्ड ख			Chapter 5. Important Topics_watermark.pdf	File	pdf	1st papper/Notes/खण्ड ख/	https://drive.google.com/file/d/1IRbyhTZzH305MHDqiWZ_pBDlwUFkBqhJ/view
1st papper	Notes	खण्ड ख			Chapter 5. New Trends (1)_watermark.pdf	File	pdf	1st papper/Notes/खण्ड ख/	https://drive.google.com/file/d/1sM2Gc74yc77g043D9ZF0bc7v_DgyOyi6/view
1st papper	Notes	खण्ड ख			Restucturing (1)_watermark.pdf	File	pdf	1st papper/Notes/खण्ड ख/	https://drive.google.com/file/d/1Wt44uES92BMeA-2IsPplp1hP5ZOnBuH2/view
1st papper	Notes	खण्ड ख	chapter 4 management		Chapter 4. CPM and PERT (1)_watermark.pdf	File	pdf	1st papper/Notes/खण्ड ख/chapter 4 management/	https://drive.google.com/file/d/1Cwq598VC41_JpUPdhhmwey5xaqXjJcR4/view
1st papper	Notes	खण्ड ख	chapter 4 management		Chapter 4. Concept of Management (2)_watermark.pdf	File	pdf	1st papper/Notes/खण्ड ख/chapter 4 management/	https://drive.google.com/file/d/1w3w4HIWfXxeOoQyUpkeBbCZrx6uEKqx_/view
1st papper	Notes	खण्ड ख	chapter 4 management		Chapter 4. Control, Coordination, Teamwork in Management (1)_watermark (1).pdf	File	pdf	1st papper/Notes/खण्ड ख/chapter 4 management/	https://drive.google.com/file/d/12PS_F-PhHIfgNTdRybLJtJGGb9r6Z0zd/view
1st papper	Notes	खण्ड ख	chapter 4 management		Chapter 4. Corporate Planning and Strategic Management (1)_watermark.pdf	File	pdf	1st papper/Notes/खण्ड ख/chapter 4 management/	https://drive.google.com/file/d/1Wd2En-wMJ27NXSF0FPv5ZWnDXGnGveEg/view
1st papper	Notes	खण्ड ख	chapter 4 management		Chapter 4. Corporate Social Responsibility (2)_watermark.pdf	File	pdf	1st papper/Notes/खण्ड ख/chapter 4 management/	https://drive.google.com/file/d/1jCFd4764phMox-yuqHiqCMcuBCFh9OzY/view
1st papper	Notes	खण्ड ख	chapter 4 management		Chapter 4. Decision Making (1)_watermark.pdf	File	pdf	1st papper/Notes/खण्ड ख/chapter 4 management/	https://drive.google.com/file/d/1_3HMNmQUeJ8qIPJSzRVDTeb_2QeGvMv7/view
1st papper	Notes	खण्ड ख	chapter 4 management		Chapter 4. Human Resource Planning (1)_watermark.pdf	File	pdf	1st papper/Notes/खण्ड ख/chapter 4 management/	https://drive.google.com/file/d/11RdVeNHWQug4cwkttPEDlEJC2Y2MRqel/view
1st papper	Notes	खण्ड ख	chapter 4 management		Chapter 4. Leadership (1)_watermark.pdf	File	pdf	1st papper/Notes/खण्ड ख/chapter 4 management/	https://drive.google.com/file/d/1W_ItnRBJcRTCCtZF-5gcDDzeeHHluyY4/view
1st papper	Notes	खण्ड ख	chapter 4 management		Chapter 4. Motivation (1)_watermark.pdf	File	pdf	1st papper/Notes/खण्ड ख/chapter 4 management/	https://drive.google.com/file/d/1a4JZv5CTuAqwlHEJSEjf09TA48HhBykm/view
1st papper	Notes	खण्ड ख	chapter 4 management		Chapter 4. Project Control Cycle (1)_watermark.pdf	File	pdf	1st papper/Notes/खण्ड ख/chapter 4 management/	https://drive.google.com/file/d/1w5JHNNltumTAbsaAr93lQwZJ1g2_shPN/view
1st papper	Notes	खण्ड ख	chapter 4 management		Chapter 4. Project Monitoring And Control (1)_watermark.pdf	File	pdf	1st papper/Notes/खण्ड ख/chapter 4 management/	https://drive.google.com/file/d/1EXXmh622wjkaclB0OEVONhsn71XIEm45/view
1st papper	Notes	खण्ड ख	chapter 4 management		Chapter 4. Resource Scheduling (1)_watermark.pdf	File	pdf	1st papper/Notes/खण्ड ख/chapter 4 management/	https://drive.google.com/file/d/1pQC0W5tN1dLRABDndFlk_FmlpCQwzpNF/view
1st papper	Notes	खण्ड ख	chapter 4 management		Chapter 4. Tariff Structure (1)_watermark.pdf	File	pdf	1st papper/Notes/खण्ड ख/chapter 4 management/	https://drive.google.com/file/d/1Ndr-O7JHBDle9E5SXYdSjP85M0O--EnT/view
1st papper	Notes	खण्ड ख	chapter 4 management		Restucturing (1)_watermark.pdf	File	pdf	1st papper/Notes/खण्ड ख/chapter 4 management/	https://drive.google.com/file/d/1Wt44uES92BMeA-2IsPplp1hP5ZOnBuH2/view
1st papper	Notes	खण्ड ख			कर्मचारी सेवा  NEA marked.pdf	File	pdf	1st papper/Notes/खण्ड ख/	https://drive.google.com/file/d/1lWd5yVHWiyvIt-8ZG12bXIaDkDs_KCdw/view
1st papper	Notes	खण्ड ख			नीति_watermark.pdf	File	pdf	1st papper/Notes/खण्ड ख/	https://drive.google.com/file/d/1DPxxzel5KdaBK0dYNikqD8QY1xMgRkVc/view
1st papper	Notes	खण्ड ख			नेपाल-विद्युत-प्राधिकरण-ऐन-२०४१ marked_watermark.pdf	File	pdf	1st papper/Notes/खण्ड ख/	https://drive.google.com/file/d/1M-pw8fVgiZhXGCase9JShbZHWFrMyDeI/view
1st papper	Notes	खण्ड ख			नेपालको संविधान_watermark.pdf	File	pdf	1st papper/Notes/खण्ड ख/	https://drive.google.com/file/d/18TvA4N-cAybCafX6-2BQoDhwR2eCP2A5/view
1st papper	Notes	खण्ड ख			विद्युत-ऐन-२०४९_watermark.pdf	File	pdf	1st papper/Notes/खण्ड ख/	https://drive.google.com/file/d/1XtURfAFyY6mX457WmrlsE3PSAZZJzoiD/view
1st papper	Notes	खण्ड ख			सार्वजनिक खरिद व्यवस्थापनका समस्याहरु_watermark.pdf	File	pdf	1st papper/Notes/खण्ड ख/	https://drive.google.com/file/d/19Jr6OGZBeFXs_101y8l-656sot_Rok9Y/view
1st papper	Old Questions				NEA Electrical level 7 Old Question  (1).pdf	File	pdf	1st papper/Old Questions/	https://drive.google.com/file/d/1sNe46hhwZSIg0El8H5QhAX5-XUzwv5tK/view
1st papper	Old Questions				first paper 78.jpg	File	jpg	1st papper/Old Questions/	https://drive.google.com/file/d/1obvlrYNkoTs8Bf9BVAX5X7Az7To6fkK/view?usp=share_link
1st papper	Old Questions				first paper 81.jpg	File	jpg	1st papper/Old Questions/	https://drive.google.com/file/d/1obvlrYNkoTs8Bf9BVAX5X7Az7To6fkK/view?usp=share_link
1st papper	videos	GK			Day 1 magh 8 .mp4.mp4	File	mp4	1st papper/videos/GK/	https://drive.google.com/file/d/1p6kSHCvoTD9eYpiPoIiYnGULoMrFPvws/view
1st papper	videos	GK			Day 10 magh 20.mp4.mp4	File	mp4	1st papper/videos/GK/	https://drive.google.com/file/d/12doGEZGWMQob88XV4OqlEhiCamkK6hZv/view
1st papper	videos	GK			Day 11 magh 22.mp4.mp4	File	mp4	1st papper/videos/GK/	https://drive.google.com/file/d/1O1yoSwHvGVcxdRnpgQYIIguxqwHWrpAS/view
1st papper	videos	GK			Day 12 magh 23.mp4.mp4	File	mp4	1st papper/videos/GK/	https://drive.google.com/file/d/1mvosKpq0xmyiaV0U49x69OidLXxvEeyn/view
1st papper	videos	GK			Day 13 magh 24.mp4.mp4	File	mp4	1st papper/videos/GK/	https://drive.google.com/file/d/1A21aipLV8l8e1xJ80EGadIsVzzEW4XT6/view
1st papper	videos	GK			Day 14 magh 25.mp4.mp4	File	mp4	1st papper/videos/GK/	https://drive.google.com/file/d/1S-QQLWPCQsjc6xIz3_6zs6Yd_4OZr4Tf/view
1st papper	videos	GK			Day 15 magh 27.mp4.mp4	File	mp4	1st papper/videos/GK/	https://drive.google.com/file/d/1FjY3J17Vt2zqRARUFh6JgMqXnMD-OB3I/view
1st papper	videos	GK			Day 17 magh 29.mp4.mp4	File	mp4	1st papper/videos/GK/	https://drive.google.com/file/d/14xutgFMxFg9BR4Eo84D_mbR4MresxtQ6/view
1st papper	videos	GK			Day 18 magh 30.mp4.mp4	File	mp4	1st papper/videos/GK/	https://drive.google.com/file/d/1nYzZo0NcT31wJsBQrz9KTzu4KL4eCSlF/view
1st papper	videos	GK			Day 19 falgun 1.mp4.mp4	File	mp4	1st papper/videos/GK/	https://drive.google.com/file/d/1uFqEHzCt74jPGlOzyPfahNCNMPUNHF1h/view
1st papper	videos	GK			Day 2 magh 9.mp4.mp4	File	mp4	1st papper/videos/GK/	https://drive.google.com/file/d/16rYbwHjdWltAQS-2A7cCKg-K0lnnOZ1y/view
1st papper	videos	GK			Day 3 magh 10 .mp4.mp4	File	mp4	1st papper/videos/GK/	https://drive.google.com/file/d/1xbuG_CW7Sjd37ducI_tqt8QK1R46976L/view
1st papper	videos	GK			Day 4 magh 13.mp4.mp4	File	mp4	1st papper/videos/GK/	https://drive.google.com/file/d/1KSRqmEnwXXqZs4djfNOSRiqyflf18jw-/view
1st papper	videos	GK			Day 5 magh 14.mp4.mp4	File	mp4	1st papper/videos/GK/	https://drive.google.com/file/d/1FTEIDO2eB74CR--oc5ePYfYJLTfWL2aO/view
1st papper	videos	GK			Day 6 magh 15 .mp4.mp4	File	mp4	1st papper/videos/GK/	https://drive.google.com/file/d/1dyae4xbhH67nQLXGWtei08kVY3MI3mEd/view
1st papper	videos	GK			Day 7 magh 16 .mp4.mp4	File	mp4	1st papper/videos/GK/	https://drive.google.com/file/d/1ufS2POhf-ncUyRbuYpr5KLka4NYiNcwt/view
1st papper	videos	GK			Day 8 magh 17.mp4.mp4	File	mp4	1st papper/videos/GK/	https://drive.google.com/file/d/1sK7V_IMIqOPpCDs_babEGrIIkHd0w8L-/view
1st papper	videos	GK			Day 9 magh 18.mp4.mp4	File	mp4	1st papper/videos/GK/	https://drive.google.com/file/d/13tbbOGA4gOnd3A5RpaAStfUeevZ-6iv5/view
1st papper	videos	GK			day 16 magh 28.mp4.mp4	File	mp4	1st papper/videos/GK/	https://drive.google.com/file/d/1qJ6emoTbIqSGW_1lHceJy0WtC8a3T0Ss/view
1st papper	videos	GK			samasamahik jestha 5.mp4.mp4	File	mp4	1st papper/videos/GK/	https://drive.google.com/file/d/1LQrnQDuIBbOCy_GB6H9hUzqLUeDRn9Ku/view
1st papper	videos	IQ			Day 1 poush 2.mp4.mp4	File	mp4	1st papper/videos/IQ/	https://drive.google.com/file/d/1ii1-uhW_WxKePEASCf2l96ljpto9sjjF/view
1st papper	videos	IQ			Day 10 poush 14.mp4.mp4	File	mp4	1st papper/videos/IQ/	https://drive.google.com/file/d/1PC66Xxx7rX15ECqNanHG4amU-ka-5WAO/view
1st papper	videos	IQ			Day 11  poush 15.mp4.mp4	File	mp4	1st papper/videos/IQ/	https://drive.google.com/file/d/1kKwcFfemnDjgiXzCvnShCR51dUO_hJRu/view
1st papper	videos	IQ			Day 12 Poush 17.mp4.mp4	File	mp4	1st papper/videos/IQ/	https://drive.google.com/file/d/111wTgK3WN5peLjzaS01XvIj1G4R5Cksv/view
1st papper	videos	IQ			Day 13 Poush 18.mp4.mp4	File	mp4	1st papper/videos/IQ/	https://drive.google.com/file/d/1JQIJqbf5u9Ng9CSYYNMSVDoFYaRxpDdf/view
1st papper	videos	IQ			Day 14 poush 21.mp4.mp4	File	mp4	1st papper/videos/IQ/	https://drive.google.com/file/d/1u-5_bzYUkA62df_UBQdmFHT9V2oAAmzE/view
1st papper	videos	IQ			Day 15 poush 22.mp4.mp4	File	mp4	1st papper/videos/IQ/	https://drive.google.com/file/d/1na-OVxbYp9uBvImFECy-l3E0dpmttJ27/view
1st papper	videos	IQ			Day 16 Poush 24.mp4.mp4	File	mp4	1st papper/videos/IQ/	https://drive.google.com/file/d/1K_RhMCKw8IR0_hjIbn_r8WvC4_IXrh6g/view
1st papper	videos	IQ			Day 17  Poush 25.mp4.mp4	File	mp4	1st papper/videos/IQ/	https://drive.google.com/file/d/1yqfJHc3WXUUZn4YT61L_0_YMyj-XbM_4/view
1st papper	videos	IQ			Day 2 poush 3.mp4.mp4	File	mp4	1st papper/videos/IQ/	https://drive.google.com/file/d/1tT9HtXzn-tc0GKJDpsgrmETv5a9MHW92/view
1st papper	videos	IQ			Day 3 poush 4.mp4.mp4	File	mp4	1st papper/videos/IQ/	https://drive.google.com/file/d/1kf_GXHqUXfeqhrJzHV1PS86z1E4ml9Bh/view
1st papper	videos	IQ			Day 4 poush 6.mp4.mp4	File	mp4	1st papper/videos/IQ/	https://drive.google.com/file/d/1JTYHSoaa1Tfc7Uc6qPJvq1cbUKje9irN/view
1st papper	videos	IQ			Day 5 poush 7 .mp4.mp4	File	mp4	1st papper/videos/IQ/	https://drive.google.com/file/d/1by5qny_LKv-zDP8BJWCwvi_jRAIk22SL/view
1st papper	videos	IQ			Day 6 poush 8.mp4.mp4	File	mp4	1st papper/videos/IQ/	https://drive.google.com/file/d/1xJIMbHZdJRqqnfTWMhyirXjpP517R4nf/view
1st papper	videos	IQ			Day 7 Poush 9.mp4.mp4	File	mp4	1st papper/videos/IQ/	https://drive.google.com/file/d/1VFjnNPvsEFH_3cfvPOccnJA-JbNB7AGY/view
1st papper	videos	IQ			Day 8 poush 10.mp4.mp4	File	mp4	1st papper/videos/IQ/	https://drive.google.com/file/d/1y8R08ZM-LjWDHWFHKuyTJQfdZaeyqIwi/view
1st papper	videos	IQ			Day 9 posh 12.mp4.mp4	File	mp4	1st papper/videos/IQ/	https://drive.google.com/file/d/1e_IAj6v1Ali5cqoYJOqk3wkdY_zZB2q_/view
1st papper	videos	Khanda Kha			Day 10 mansir 16.mp4.mp4	File	mp4	1st papper/videos/Khanda Kha/	https://drive.google.com/file/d/1BUptkvwmnWtoYznZ6REHPVoZrQsjxbWL/view
1st papper	videos	Khanda Kha			Day 11 mansir 17.mp4.mp4	File	mp4	1st papper/videos/Khanda Kha/	https://drive.google.com/file/d/1FF0ixeFvpkG0OmgpNtznNVqbYKUZuuIP/view
1st papper	videos	Khanda Kha			Day 12 mansir 18.mp4.mp4	File	mp4	1st papper/videos/Khanda Kha/	https://drive.google.com/file/d/12SJKgDN6afd9fpioStXp1PoZOPCN7Y3Z/view
1st papper	videos	Khanda Kha			Day 13 mansir 19.mp4.mp4	File	mp4	1st papper/videos/Khanda Kha/	https://drive.google.com/file/d/1AFJjWVloLMkB06-rxZc5zEPzKzPJzHEM/view
1st papper	videos	Khanda Kha			Day 14 mansir 20.mp4.mp4	File	mp4	1st papper/videos/Khanda Kha/	https://drive.google.com/file/d/1sppxmOy01HJDZCCrumzFZopyRXDA9x06/view
1st papper	videos	Khanda Kha			Day 15 mansir 21.mp4.mp4	File	mp4	1st papper/videos/Khanda Kha/	https://drive.google.com/file/d/1x6lo33BK0Ak_lTKzmobJxWlncnR7IHhm/view
1st papper	videos	Khanda Kha			Day 16 mansir 23.mp4.mp4	File	mp4	1st papper/videos/Khanda Kha/	https://drive.google.com/file/d/1W2mYg3uEczuB3NYXkHwfZM7n0jZipQjs/view
1st papper	videos	Khanda Kha			Day 17 mansir 24.mp4.mp4	File	mp4	1st papper/videos/Khanda Kha/	https://drive.google.com/file/d/1VpMBVTN50-PmH2p8Ph4IyJHzbO_JHNp6/view
1st papper	videos	Khanda Kha			Day 18 mansir 25.mp4.mp4	File	mp4	1st papper/videos/Khanda Kha/	https://drive.google.com/file/d/1yfzkGPTi6wXsOiFbwvTnzNQbkEHdJquO/view
1st papper	videos	Khanda Kha			Day 19 mansir 27.mp4.mp4	File	mp4	1st papper/videos/Khanda Kha/	https://drive.google.com/file/d/1DxQxUKlscmyhs4OIA2mgB9I1Iplwdh1j/view
1st papper	videos	Khanda Kha			Day 20 mansir 28.mp4.mp4	File	mp4	1st papper/videos/Khanda Kha/	https://drive.google.com/file/d/1cBWAC7aiPOhxRog458NkfhIMawLI7H_k/view
1st papper	videos	Khanda Kha			Day 21 mansir 29.mp4.mp4	File	mp4	1st papper/videos/Khanda Kha/	https://drive.google.com/file/d/1hHYpblaUyq-I2l_rJ04DkW5GM1eEyGo3/view
1st papper	videos	Khanda Kha			Day 22 mansir 30.mp4.mp4	File	mp4	1st papper/videos/Khanda Kha/	https://drive.google.com/file/d/1tI4QB9PwswGa-zLmyFhd4j954WrxpT-M/view
1st papper	videos	Khanda Kha			Day 4 mansir 10.mp4.mp4	File	mp4	1st papper/videos/Khanda Kha/	https://drive.google.com/file/d/1wihW_B62E6iu-VupzjIY_7kdpVblAVii/view
1st papper	videos	Khanda Kha			Day 6 mansir 12.mp4.mp4	File	mp4	1st papper/videos/Khanda Kha/	https://drive.google.com/file/d/146bjWS4D5qPEyyJRK4cl6TJpaskQRufo/view
1st papper	videos	Khanda Kha			Day 8 mansir 14.mp4.mp4	File	mp4	1st papper/videos/Khanda Kha/	https://drive.google.com/file/d/114Ip2S6PhmyS8XASDkGqAGbQbDU8LlSN/view
1st papper	videos	Khanda Kha			Day 9 mansir 15.mp4.mp4	File	mp4	1st papper/videos/Khanda Kha/	https://drive.google.com/file/d/1ccgPqH85flfoYhTkmehA99d0kQ8nVCe6/view
1st papper	videos	Khanda Kha			day 1 mansir 5.mp4.mp4	File	mp4	1st papper/videos/Khanda Kha/	https://drive.google.com/file/d/1IVxhCj0hqNMO4l-PEn2MwlG7fRLHUQSb/view
1st papper	videos	Khanda Kha			day 2 mansir 6.mp4.mp4	File	mp4	1st papper/videos/Khanda Kha/	https://drive.google.com/file/d/1lqlNw72P8xs1olLfqz5JBBfoLWeEavCz/view
1st papper	videos	Khanda Kha			day 3 mansir 9.mp4.mp4	File	mp4	1st papper/videos/Khanda Kha/	https://drive.google.com/file/d/1Koolw0FYl_3InisCvVzbBc-LStOGpxwP/view
1st papper	videos	Khanda Kha			day 5 mansir 11.mp4.mp4	File	mp4	1st papper/videos/Khanda Kha/	https://drive.google.com/file/d/1rE5XEL7JTqM9NT2SlvvglGFit-PjLhR_/view
1st papper	videos	Khanda Kha			day 7 mansir 13.mp4.mp4	File	mp4	1st papper/videos/Khanda Kha/	https://drive.google.com/file/d/1nb3A3QJq91jsyKJVRxk2msnkP6A-r53t/view
1st papper	videos	Khanda Kha			orientation class.mp4.mp4	File	mp4	1st papper/videos/Khanda Kha/	https://drive.google.com/file/d/1cx8Ko7_cyhm7AV7Y4Xp6D9lRzMRs1eKO/view
2nd papper	Notes	1. Fundamentals			1.3 Superposition, Nortons, Thevenins, Maxm Power, Reciprocity.pdf	File	pdf	2nd papper/Notes/1. Fundamentals/	https://drive.google.com/file/d/1jNZCjiTFbDBuzZEEZA7LjDZPclg9B610/view
2nd papper	Notes	1. Fundamentals			1.5_Series Parallel AC Circuits (1)_watermark.pdf	File	pdf	2nd papper/Notes/1. Fundamentals/	https://drive.google.com/file/d/1BHN_qMRNnfnUdxGtktPqCq_5-hlU2TZp/view
2nd papper	Notes	1. Fundamentals			1.6_Three Phase Systems_watermark.pdf	File	pdf	2nd papper/Notes/1. Fundamentals/	https://drive.google.com/file/d/1JQYbHn-PhZjZXIJm0ehpxUGy3lEdec2I/view
2nd papper	Notes	1. Fundamentals			1.7 Circuit Analysis by Laplace Transform.pdf	File	pdf	2nd papper/Notes/1. Fundamentals/	https://drive.google.com/file/d/1RH8zMrT3v8sgRLMTQ8BmEA5LlJLL5Ptp/view
2nd papper	Notes	1. Fundamentals			1.7 Circuit Analysis.pdf	File	pdf	2nd papper/Notes/1. Fundamentals/	https://drive.google.com/file/d/1magFIziU_VddzxwL3dhdOke5b0hJ5-9L/view
2nd papper	Notes	1. Fundamentals			1.7 Inverting and Non-inverting Amplifier.pdf	File	pdf	2nd papper/Notes/1. Fundamentals/	https://drive.google.com/file/d/1kZqIwoA0bM2w6qg8wpSYmw9MCyKJAdrM/view
2nd papper	Notes	1. Fundamentals			1.7 Transfer Function (1).pdf	File	pdf	2nd papper/Notes/1. Fundamentals/	https://drive.google.com/file/d/123rlsDyvLdgYUviylKb9ZvHrESbWPqi5/view
2nd papper	Notes	1. Fundamentals			1.7 Transfer Function (2).pdf	File	pdf	2nd papper/Notes/1. Fundamentals/	https://drive.google.com/file/d/1sBHziqgVdqYnpAJ4QZMN7FstxsDYwuyY/view
2nd papper	Notes	1. Fundamentals			1.7 Transfer Function.pdf	File	pdf	2nd papper/Notes/1. Fundamentals/	https://drive.google.com/file/d/1jXIjKlTvbJmP2x9OU8aASy1k51S3jK8O/view
2nd papper	Notes	1. Fundamentals			1.7 Two Port Networks.pdf	File	pdf	2nd papper/Notes/1. Fundamentals/	https://drive.google.com/file/d/1tqLo407oQumdbBXBBSoq9ZOvtcKR4ryL/view
2nd papper	Notes	10. Safety Engineering			Chapter 10 Safety Engineering Part 1_watermark.pdf	File	pdf	2nd papper/Notes/10. Safety Engineering/	https://drive.google.com/file/d/1Vg6KJSQo5IxCPqwZ0hZG3-0HXfsllQv5/view
2nd papper	Notes	10. Safety Engineering			Chapter 10 Safety Engineering Part 2_watermark.pdf	File	pdf	2nd papper/Notes/10. Safety Engineering/	https://drive.google.com/file/d/1FzBdmLQ_Lci8WSnNzJ7W8ic5_26tHoBg/view
2nd papper	Notes	10. Safety Engineering			Safety Engineering_watermark.pdf	File	pdf	2nd papper/Notes/10. Safety Engineering/	https://drive.google.com/file/d/1pceGyijWdGPtY_2WCCDlkrVi585jGFtd/view
2nd papper	Notes	11.Instrumentation and Control			Automatic feedback control system_watermark.pdf	File	pdf	2nd papper/Notes/11.Instrumentation and Control/	https://drive.google.com/file/d/1noJ9lEIWp21WQ6K0h41hUZ8aKWbHcdqY/view
2nd papper	Notes	11.Instrumentation and Control			PID_watermark.pdf	File	pdf	2nd papper/Notes/11.Instrumentation and Control/	https://drive.google.com/file/d/1WH8V-iVziSyIKykIWqOW0mn3pncK5bp7/view
2nd papper	Notes	11.Instrumentation and Control			control system.zip	File	zip	2nd papper/Notes/11.Instrumentation and Control/	#N/A
2nd papper	Notes	11.Instrumentation and Control			electrical measurements_watermark.pdf	File	pdf	2nd papper/Notes/11.Instrumentation and Control/	https://drive.google.com/file/d/1ziI3QU6FB759ICONi-IZYSdZK6_sqrep/view
2nd papper	Notes	11.Instrumentation and Control			sensors and transducers_watermark.pdf	File	pdf	2nd papper/Notes/11.Instrumentation and Control/	https://drive.google.com/file/d/1CM5ySgFCNs3Nfn62LBKBOWyUHjoIc-0H/view
2nd papper	Notes	12.standard			12.1 Technical Standards_watermark.pdf	File	pdf	2nd papper/Notes/12.standard/	https://drive.google.com/file/d/1F5Ja9KXlWfnYogqV4mfb8jmumYLasiaT/view
2nd papper	Notes	12.standard			12.2 Accreditation_watermark.pdf	File	pdf	2nd papper/Notes/12.standard/	https://drive.google.com/file/d/1Kv5lZcX0XuVv55xk1fQXzRAuv2YaJuSA/view
2nd papper	Notes	12.standard			12.3 Calibration.pdf	File	pdf	2nd papper/Notes/12.standard/	https://drive.google.com/file/d/1FQVhmyFUR0NqKQPgaOT-q-kT4g2Q-pmK/view
2nd papper	Notes	2.Electrical Machines			2.1_Magnetic Circuits.pdf	File	pdf	2nd papper/Notes/2.Electrical Machines/	https://drive.google.com/file/d/1YUUaguy17GARx07UiKSsSkFgX2QrTfBp/view
2nd papper	Notes	2.Electrical Machines			2.2_Transformers.pdf	File	pdf	2nd papper/Notes/2.Electrical Machines/	https://drive.google.com/file/d/1HMvbOVxvEhj6AEuVTl7d689WwLw6O1jN/view
2nd papper	Notes	2.Electrical Machines			2.3_DC Machines.pdf	File	pdf	2nd papper/Notes/2.Electrical Machines/	https://drive.google.com/file/d/1WkmqgbpFI5hVvGWA4SiteANSdI10-c_F/view
2nd papper	Notes	2.Electrical Machines			2.4_Synchronous Machines.pdf	File	pdf	2nd papper/Notes/2.Electrical Machines/	https://drive.google.com/file/d/11AwFTwmaGMDhuDxrovOf9psMnMiuFJHL/view
2nd papper	Notes	2.Electrical Machines			2.5 Induction Generator.pdf	File	pdf	2nd papper/Notes/2.Electrical Machines/	https://drive.google.com/file/d/1ih_3JP1SuJgAcwu31inDgek3wTC7BTl_/view
2nd papper	Notes	2.Electrical Machines			2.5_Induction Machines.pdf	File	pdf	2nd papper/Notes/2.Electrical Machines/	https://drive.google.com/file/d/18KzvPN_f5rt0FO0lrt-eizdncEx2GFxJ/view
2nd papper	Notes	2.Electrical Machines			Applications of Various Motors.pdf	File	pdf	2nd papper/Notes/2.Electrical Machines/	https://drive.google.com/file/d/1fVVpl5ALT6gIMRjdgSy0LarfICDZ-g6u/view
2nd papper	Notes	2.Electrical Machines			Speed Control of Induction Motors.pdf	File	pdf	2nd papper/Notes/2.Electrical Machines/	https://drive.google.com/file/d/1fVPZWkvsuiz4gTVkgbBYkjNZNEzCxDrC/view
2nd papper	Notes	4.Transmission and Distribution			4.1 Sag and Tension_watermark.pdf	File	pdf	2nd papper/Notes/4.Transmission and Distribution/	https://drive.google.com/file/d/13TruYSWC_eNBodQx5fEtQdj6YxbUWTnR/view
2nd papper	Notes	4.Transmission and Distribution			4.1 Surge Impedance Loading_watermark.pdf	File	pdf	2nd papper/Notes/4.Transmission and Distribution/	https://drive.google.com/file/d/1fiIYpFZEFAFPD8epk7N4uPI8e3fKZhGL/view
2nd papper	Notes	4.Transmission and Distribution			4.1 Vibration Dampers (1)_watermark.pdf	File	pdf	2nd papper/Notes/4.Transmission and Distribution/	https://drive.google.com/file/d/1xoL3rULGtmw4GgqilIoMhhSRKWruRSao/view
2nd papper	Notes	4.Transmission and Distribution			4.2 ABCD parameter (1).pdf	File	pdf	2nd papper/Notes/4.Transmission and Distribution/	https://drive.google.com/file/d/1vjr7qlWkpZCXxRx3S54HBhPO9-8q9Zfn/view
2nd papper	Notes	4.Transmission and Distribution			4.2 Ferranti Effect_watermark.pdf	File	pdf	2nd papper/Notes/4.Transmission and Distribution/	https://drive.google.com/file/d/1gzXkPc0jX6J9NbNbbtEXXU0g8-ut2WPy/view
2nd papper	Notes	4.Transmission and Distribution			4.2 Performance of Tr. Lines_watermark.pdf	File	pdf	2nd papper/Notes/4.Transmission and Distribution/	https://drive.google.com/file/d/1zX0dUR9k0plAbn1XLS3b--p4G7pn5beV/view
2nd papper	Notes	4.Transmission and Distribution			4.2 V.R. of capacitive load (1).pdf	File	pdf	2nd papper/Notes/4.Transmission and Distribution/	https://drive.google.com/file/d/1SV6gXiP2XOEZ2HifBK-V-gfUg5nUIbBw/view
2nd papper	Notes	4.Transmission and Distribution			4.3 Corona Inception Voltage_watermark.pdf	File	pdf	2nd papper/Notes/4.Transmission and Distribution/	https://drive.google.com/file/d/1-NB8MS8Q8eglObAOIEk1p8ZaI00GSTh7/view
2nd papper	Notes	4.Transmission and Distribution			4.3 Corona_watermark.pdf	File	pdf	2nd papper/Notes/4.Transmission and Distribution/	https://drive.google.com/file/d/1oG3VAosggzVSHQK1rmDzMtm2k-ohMobZ/view
2nd papper	Notes	4.Transmission and Distribution			4.5 Bus Bar Schemes_watermark.pdf	File	pdf	2nd papper/Notes/4.Transmission and Distribution/	https://drive.google.com/file/d/1aPulAJh9XM9bG_jXaiz5qSkdbhxnTrwX/view
2nd papper	Notes	4.Transmission and Distribution			4.5 Distribution Components of Distribution System_watermark.pdf	File	pdf	2nd papper/Notes/4.Transmission and Distribution/	https://drive.google.com/file/d/1oRIFuhKeu8GjwAYPUuciSGxru4LTxci0/view
2nd papper	Notes	4.Transmission and Distribution			4.5 Distribution System (1)_watermark.pdf	File	pdf	2nd papper/Notes/4.Transmission and Distribution/	https://drive.google.com/file/d/1q0rv5_jmb1Bg-fsJe7sQlwkkCQLxMKCY/view
2nd papper	Notes	4.Transmission and Distribution			4.5 Distribution System Schemes, Pole Types, Insulator Types_watermark (1).pdf	File	pdf	2nd papper/Notes/4.Transmission and Distribution/	https://drive.google.com/file/d/1x47-e9h8cDA7wOZA75sihZMaBhtwQXO_/view
2nd papper	Notes	4.Transmission and Distribution			4.5 Key Design Considerations for Conductor Size Selection in Distribution Systems_watermark.pdf	File	pdf	2nd papper/Notes/4.Transmission and Distribution/	https://drive.google.com/file/d/1SOdGiNXW16UIRe4wbIH1k6OtH-4s8eM4/view
2nd papper	Notes	4.Transmission and Distribution			4.5 Substation Location and Size criteria_watermark.pdf	File	pdf	2nd papper/Notes/4.Transmission and Distribution/	https://drive.google.com/file/d/1O0pSLmc9342yP-Uix2oMQHKusIneaX08/view
2nd papper	Notes	4.Transmission and Distribution			My Note part 2_watermark.pdf	File	pdf	2nd papper/Notes/4.Transmission and Distribution/	https://drive.google.com/file/d/1fQwSg55ODxif5cmYrXeUurEhDoLMaqJD/view
2nd papper	Notes	4.Transmission and Distribution			Why Transmission Lines are designed for the WORST PROBABLE CONDITIONS_watermark.pdf	File	pdf	2nd papper/Notes/4.Transmission and Distribution/	https://drive.google.com/file/d/1BiBU6pIFB8AxMSAeCf5bpbMeo5_-7gc5/view
2nd papper	Notes	5.Power System Analysis			5.1 P-f and Q-V Balance_watermark.pdf	File	pdf	2nd papper/Notes/5.Power System Analysis/	https://drive.google.com/file/d/1G7pZOXGZWmLuxvXwNPwk_5F1SkHEcvdc/view
2nd papper	Notes	5.Power System Analysis			5.1 Power Flow_watermark.pdf	File	pdf	2nd papper/Notes/5.Power System Analysis/	https://drive.google.com/file/d/14_VlBElmG7w5b6cvKSZfUN7-Chj76mob/view
2nd papper	Notes	5.Power System Analysis			5.1 Solve equations using iterative methods_watermark.pdf	File	pdf	2nd papper/Notes/5.Power System Analysis/	https://drive.google.com/file/d/19-xoCuJdeXy75lEZXdKcWCWdukvQnPrp/view
2nd papper	Notes	5.Power System Analysis			5.1 Voltage Profile of a Transmission Line_watermark.pdf	File	pdf	2nd papper/Notes/5.Power System Analysis/	https://drive.google.com/file/d/1zkQsOW_FPQCEY5_IQgRFwa3JF9p0OUqE/view
2nd papper	Notes	5.Power System Analysis			5.2 Faults in Power System.pdf	File	pdf	2nd papper/Notes/5.Power System Analysis/	https://drive.google.com/file/d/1CHFmHGy6SUg4TlialMu17K3h9Fxnl-tZ/view
2nd papper	Notes	5.Power System Analysis			5.2 Power System Stability.pdf	File	pdf	2nd papper/Notes/5.Power System Analysis/	https://drive.google.com/file/d/1ifHh2B61wbrdHo_Vl_xJE7f8h153Hf_2/view
2nd papper	Notes	5.Power System Analysis			5.3 Faults in Power System.pdf	File	pdf	2nd papper/Notes/5.Power System Analysis/	https://drive.google.com/file/d/15B5fOEESh8qyL-fU2k4KLWATrbWAaLtp/view
2nd papper	Notes	5.Power System Analysis			5.3 Generator Protection.pdf	File	pdf	2nd papper/Notes/5.Power System Analysis/	https://drive.google.com/file/d/11tVABgK4jAt6xFgeOu8RTx79_c9jJ5-q/view
2nd papper	Notes	5.Power System Analysis			5.3 TL & Feeder protection.pdf	File	pdf	2nd papper/Notes/5.Power System Analysis/	https://drive.google.com/file/d/1iYcI_2bWsSo5fZYOCGawOaTOuBX6R8gL/view
2nd papper	Notes	5.Power System Analysis			5.3 Transformer Protection.pdf	File	pdf	2nd papper/Notes/5.Power System Analysis/	https://drive.google.com/file/d/1gMNB1FSGPhfI3fSGsOJIivChmjWFkO4l/view
2nd papper	Notes	5.Power System Analysis			5.4 ABT and Load Dispatcher.pdf	File	pdf	2nd papper/Notes/5.Power System Analysis/	https://drive.google.com/file/d/1_ffAwGvuGVKRxuVYaw676rF2aDoKjbaw/view
2nd papper	Notes	5.Power System Analysis			5.4 Choice of Tr. Voltage, ROW.pdf	File	pdf	2nd papper/Notes/5.Power System Analysis/	https://drive.google.com/file/d/19xzEa4W7YuCNxTfr2MvPvrA3EymieYUa/view
2nd papper	Notes	5.Power System Analysis			5.4 Load Dispatch.pdf	File	pdf	2nd papper/Notes/5.Power System Analysis/	https://drive.google.com/file/d/12FI6H8MjCl-2eCyL8sMKuVO790cL_wFF/view
2nd papper	Notes	5.Power System Analysis			5.4 Tools and Benefits of Economic Load Dispatch.pdf	File	pdf	2nd papper/Notes/5.Power System Analysis/	https://drive.google.com/file/d/1lyJNv559BmuO6_Z2ZimnyIGyBELK9yUq/view
2nd papper	Videos	1.Electrical Engineering Fundamentals			Day 1 falgun 14.mp4.mp4	File	mp4	2nd papper/Videos/1.Electrical Engineering Fundamentals/	https://drive.google.com/file/d/1GUnz0N6XW_9r6aOnZeBFlmNhhPZodvaZ/view
2nd papper	Videos	1.Electrical Engineering Fundamentals			Day 2 falun 15.mp4.mp4	File	mp4	2nd papper/Videos/1.Electrical Engineering Fundamentals/	https://drive.google.com/file/d/1VSLDKB6WPmzav5Ejl4pKAoeql1THukXD/view
2nd papper	Videos	1.Electrical Engineering Fundamentals			Day 3 falgun 16.mp4.mp4	File	mp4	2nd papper/Videos/1.Electrical Engineering Fundamentals/	https://drive.google.com/file/d/1HQU0TiykD-xZ1My74fb0gAXE2YHhiwpZ/view
2nd papper	Videos	1.Electrical Engineering Fundamentals			Day 4 baishak 22 ( morning ) .mp4.mp4	File	mp4	2nd papper/Videos/1.Electrical Engineering Fundamentals/	https://drive.google.com/file/d/1DJdzrx27L4suKZJuMI-jIF-XoQJ5jQk2/view
2nd papper	Videos	10.Safety Engineering			Day 1 falgun 20.mp4.mp4	File	mp4	2nd papper/Videos/10.Safety Engineering/	https://drive.google.com/file/d/1zETEXCO0EyPABxcya3QnzVHc-ZvUbVlR/view
2nd papper	Videos	10.Safety Engineering			Day 2.falgun 26mp4.mp4	File	mp4	2nd papper/Videos/10.Safety Engineering/	https://drive.google.com/file/d/124rqHhogTJPo-YMRGmuwZlPDdeCFGyfU/view
2nd papper	Videos	11.Instrumentation and Control			Day 1 baishak 28 ( morning ).mp4.mp4	File	mp4	2nd papper/Videos/11.Instrumentation and Control/	#N/A
2nd papper	Videos	11.Instrumentation and Control			Day 2 baishak 29( morning ) .mp4.mp4	File	mp4	2nd papper/Videos/11.Instrumentation and Control/	#N/A
2nd papper	Videos	11.Instrumentation and Control			Day 3 baishak 30 ( morning ) .mp4.mp4	File	mp4	2nd papper/Videos/11.Instrumentation and Control/	#N/A
2nd papper	Videos	11.Instrumentation and Control			Day 4 baishak 31 ( morning ) .mp4.mp4	File	mp4	2nd papper/Videos/11.Instrumentation and Control/	#N/A
2nd papper	Videos	2.Electrical Machines			Day 1  chaitra 19.mp4.mp4	File	mp4	2nd papper/Videos/2.Electrical Machines/	https://drive.google.com/file/d/1a7lajJut_0vQY_Yf1wmGvtdwmwKW0F2M/view
2nd papper	Videos	2.Electrical Machines			Day 10 baishak 5.mp4.mp4	File	mp4	2nd papper/Videos/2.Electrical Machines/	https://drive.google.com/file/d/1sovlUcBJVcbzDcjkaytv9NKUGlTFfOZ9/view
2nd papper	Videos	2.Electrical Machines			Day 2 chaitra 20.mp4.mp4	File	mp4	2nd papper/Videos/2.Electrical Machines/	https://drive.google.com/file/d/1e-oMFEPqfwe1gTgKan4_ojme57OwQw2v/view
2nd papper	Videos	2.Electrical Machines			Day 3 chaitra 21.mp4.mp4	File	mp4	2nd papper/Videos/2.Electrical Machines/	https://drive.google.com/file/d/1F_BoySxK37PGjzgf8hlpqqDjL12ajvGv/view
2nd papper	Videos	2.Electrical Machines			Day 4 chaitra 24.mp4.mp4	File	mp4	2nd papper/Videos/2.Electrical Machines/	https://drive.google.com/file/d/1w0PVh1cnA8rsykFBL3SAvHqwULmJlPQM/view
2nd papper	Videos	2.Electrical Machines			Day 5 chaitra 25.mp4.mp4	File	mp4	2nd papper/Videos/2.Electrical Machines/	https://drive.google.com/file/d/1ObqaSWMP5CGtphdlhD5Lu93C3AUot3To/view
2nd papper	Videos	2.Electrical Machines			Day 6 chaitra 27.mp4.mp4	File	mp4	2nd papper/Videos/2.Electrical Machines/	https://drive.google.com/file/d/17MeQdLVNx608F8Z43aahhr9f-g2bZ07Q/view
2nd papper	Videos	2.Electrical Machines			Day 7 chaitra 28.mp4.mp4	File	mp4	2nd papper/Videos/2.Electrical Machines/	https://drive.google.com/file/d/1eNqiHaYAUMypee4qXoTFLdO-lyn281AI/view
2nd papper	Videos	2.Electrical Machines			Day 8 chaitra 29.mp4.mp4	File	mp4	2nd papper/Videos/2.Electrical Machines/	https://drive.google.com/file/d/18SrsSxYYOgVkInxDQUFR8nraWGScwQZU/view
2nd papper	Videos	2.Electrical Machines			Day 9 baishak 4.mp4.mp4	File	mp4	2nd papper/Videos/2.Electrical Machines/	https://drive.google.com/file/d/1TA0LTvNdEAf2Gx_jL-7WMKD9A7cc8Gj8/view
2nd papper	Videos	3.Power Generation			Day 1 baishak 16.mp4.mp4	File	mp4	2nd papper/Videos/3.Power Generation/	https://drive.google.com/file/d/1SmMtPmhCUowFFDs3euIWn9UviMeLu7V1/view
2nd papper	Videos	3.Power Generation			Day 2 baishak 17.mp4.mp4	File	mp4	2nd papper/Videos/3.Power Generation/	https://drive.google.com/file/d/175lA5sE4d0lx7qnL8O_MCPHHlAGmEmf4/view
2nd papper	Videos	3.Power Generation			Day 3 baishak 18.mp4.mp4	File	mp4	2nd papper/Videos/3.Power Generation/	https://drive.google.com/file/d/1dfcc6ZAcXpVVSYDe1ZX1Z8ObY7xDMyrr/view
2nd papper	Videos	3.Power Generation			Day 4 baishak 19.mp4.mp4	File	mp4	2nd papper/Videos/3.Power Generation/	https://drive.google.com/file/d/1kOx-PWhjHrtvnuzmHpJlyeh7pjiNnK_C/view
2nd papper	Videos	4.Transmission and Distribution			Day 1 falgun 18.mp4.mp4	File	mp4	2nd papper/Videos/4.Transmission and Distribution/	https://drive.google.com/file/d/1N2T7LgZJAFK_eyXzX9o0rfuqrYHu5DZ7/view
2nd papper	Videos	4.Transmission and Distribution			Day 10 baishak 21 ( morning ).mp4.mp4	File	mp4	2nd papper/Videos/4.Transmission and Distribution/	https://drive.google.com/file/d/1Xg0sEkrA_e9oz6kfhQU0Fafql_295kWO/view
2nd papper	Videos	4.Transmission and Distribution			Day 2 falgun 19.mp4.mp4	File	mp4	2nd papper/Videos/4.Transmission and Distribution/	https://drive.google.com/file/d/1w-nRobMeH4HeyyUSbMXwz3T6nLKWRhTz/view
2nd papper	Videos	4.Transmission and Distribution			Day 3 falgun 22.mp4.mp4	File	mp4	2nd papper/Videos/4.Transmission and Distribution/	https://drive.google.com/file/d/1WZwziCJwA3h1BxlN8Ag5XQ5dL0LTIu5V/view
2nd papper	Videos	4.Transmission and Distribution			Day 4 falgun 23.mp4.mp4	File	mp4	2nd papper/Videos/4.Transmission and Distribution/	https://drive.google.com/file/d/1f6lkIQN-0ll-gYAxFj72AJLWMVXQ74rY/view
2nd papper	Videos	4.Transmission and Distribution			Day 5 falgun 25.mp4.mp4	File	mp4	2nd papper/Videos/4.Transmission and Distribution/	https://drive.google.com/file/d/1Z628UsD_pRbpemcABKJKWip3o5_TKUfq/view
2nd papper	Videos	4.Transmission and Distribution			Day 6 falgun 27.mp4.mp4	File	mp4	2nd papper/Videos/4.Transmission and Distribution/	https://drive.google.com/file/d/1_ATzH2ze6p8DVBGeKEB4x1FevibxIUhG/view
2nd papper	Videos	4.Transmission and Distribution			Day 7 falgun 28.mp4.mp4	File	mp4	2nd papper/Videos/4.Transmission and Distribution/	https://drive.google.com/file/d/1J9v7ksPmbY6jZhBTCI5HAgCC26YX0kSC/view
2nd papper	Videos	4.Transmission and Distribution			Day 8 chaitra 3 .mp4.mp4	File	mp4	2nd papper/Videos/4.Transmission and Distribution/	https://drive.google.com/file/d/1KaODXBsOCgSBM_Qn03gYwMmv9RG-v0IY/view
2nd papper	Videos	4.Transmission and Distribution			Day 9  baishak 1.mp4.mp4	File	mp4	2nd papper/Videos/4.Transmission and Distribution/	https://drive.google.com/file/d/1SlTfF8WkFret3AqI03MThYgVTn-3vWDc/view
2nd papper	Videos	5.Power System Analysis			Day 1 chaitra 4 .mp4.mp4	File	mp4	2nd papper/Videos/5.Power System Analysis/	https://drive.google.com/file/d/1P4IIvG5Kdzeb7yoYgcCHjGxBGum1bFTB/view
2nd papper	Videos	5.Power System Analysis			Day 10 chaitra 17.mp4.mp4	File	mp4	2nd papper/Videos/5.Power System Analysis/	https://drive.google.com/file/d/17NBvdaukKhXIk4vFYxNMESFlcaBNuHlB/view
2nd papper	Videos	5.Power System Analysis			Day 11 chaitra 18.mp4.mp4	File	mp4	2nd papper/Videos/5.Power System Analysis/	https://drive.google.com/file/d/1s8mc8d3D_3JdL8tJf1X2zHAhcUmOJYYp/view
2nd papper	Videos	5.Power System Analysis			Day 12 baishak 2.mp4.mp4	File	mp4	2nd papper/Videos/5.Power System Analysis/	https://drive.google.com/file/d/1ApEsqhhbNJ2Gklt8GHpHTmSXG-gwtlzV/view
2nd papper	Videos	5.Power System Analysis			Day 13 baishak 3 .mp4.mp4	File	mp4	2nd papper/Videos/5.Power System Analysis/	https://drive.google.com/file/d/1mKVVvv0FzglBU-9GQ99WiWX6S0zph2O1/view
2nd papper	Videos	5.Power System Analysis			Day 14 baishak 17 ( morning ) .mp4.mp4	File	mp4	2nd papper/Videos/5.Power System Analysis/	https://drive.google.com/file/d/11ZcEwPlWf3P4tuzvhF-IsJt4oJIAFSO4/view
2nd papper	Videos	5.Power System Analysis			Day 15 baishak 19 ( morning ) .mp4.mp4	File	mp4	2nd papper/Videos/5.Power System Analysis/	https://drive.google.com/file/d/1mCo3yK5OL8khSWCOB0LdED4xjTvAMMW8/view
2nd papper	Videos	5.Power System Analysis			Day 16 baishak 18 ( morning ) .mp4.mp4	File	mp4	2nd papper/Videos/5.Power System Analysis/	https://drive.google.com/file/d/1_ENpF3721dKMPauZnZvTP39f5jZjoBUW/view
2nd papper	Videos	5.Power System Analysis			Day 2 chaitra 5.mp4.mp4	File	mp4	2nd papper/Videos/5.Power System Analysis/	https://drive.google.com/file/d/1W1MXK2JZ723vHprwGMLGshShN0rz_cl5/view
2nd papper	Videos	5.Power System Analysis			Day 3 chaitra 6.mp4.mp4	File	mp4	2nd papper/Videos/5.Power System Analysis/	https://drive.google.com/file/d/1EhCDToCouOIgWwVp40wjVBhFhpm1SyJ9/view
2nd papper	Videos	5.Power System Analysis			Day 4 chaitra 7.mp4.mp4	File	mp4	2nd papper/Videos/5.Power System Analysis/	https://drive.google.com/file/d/15i8hMHF_OcxLNXKpkDuUcle9BiaZi2hi/view
2nd papper	Videos	5.Power System Analysis			Day 5 chaitra 10.mp4.mp4	File	mp4	2nd papper/Videos/5.Power System Analysis/	https://drive.google.com/file/d/1lQyEQ925QoAxPxhbyvNiifkBkBK-pEKb/view
2nd papper	Videos	5.Power System Analysis			Day 6 chaitra 11.mp4.mp4	File	mp4	2nd papper/Videos/5.Power System Analysis/	https://drive.google.com/file/d/11A5W2jVj6Ut4a_xTL7ltTIQ1UDT2G7_E/view
2nd papper	Videos	5.Power System Analysis			Day 7 chaitra 13.mp4.mp4	File	mp4	2nd papper/Videos/5.Power System Analysis/	https://drive.google.com/file/d/1sLWmx5cXc89gsgeYWac2eUSew6R5qjZA/view
2nd papper	Videos	5.Power System Analysis			Day 8 chaitra 14.mp4.mp4	File	mp4	2nd papper/Videos/5.Power System Analysis/	https://drive.google.com/file/d/1MmXbGrI4ztQ7kRdlWYkF2Up-K1oj1UtI/view
2nd papper	Videos	5.Power System Analysis			Day 9 chaitra 15.mp4.mp4	File	mp4	2nd papper/Videos/5.Power System Analysis/	https://drive.google.com/file/d/1pQeBM3NLLFTlFasP_Luz_5DGaseLcIVG/view
2nd papper	Videos	6.Power Electronics			Day 1 baishak 7.mp4.mp4	File	mp4	2nd papper/Videos/6.Power Electronics/	https://drive.google.com/file/d/1mEc70PfzG2e7Mz7gL419omu0QsadiO_t/view
2nd papper	Videos	6.Power Electronics			Day 2 baishak 8.mp4.mp4	File	mp4	2nd papper/Videos/6.Power Electronics/	https://drive.google.com/file/d/1ty-NMs7PQBi_LSaPO7UZwL7W0FeP59iA/view
2nd papper	Videos	6.Power Electronics			Day 4  baishak 10.mp4.mp4	File	mp4	2nd papper/Videos/6.Power Electronics/	https://drive.google.com/file/d/1P-_nhVyGxWwnGx6P6o_gs7KTAGUMBucD/view
2nd papper	Videos	6.Power Electronics			Day 5 baishak 11.mp4.mp4	File	mp4	2nd papper/Videos/6.Power Electronics/	https://drive.google.com/file/d/1xHSmeZL2wuK-VdFGRAGBIOS-TNgZB4EK/view
2nd papper	Videos	6.Power Electronics			Day 6 baishak 12.mp4.mp4	File	mp4	2nd papper/Videos/6.Power Electronics/	https://drive.google.com/file/d/11-yuC1FA4-xER5zhJlKDQCdZuGlqCFMr/view
2nd papper	Videos	6.Power Electronics			Day 7 baishak 13.mp4.mp4	File	mp4	2nd papper/Videos/6.Power Electronics/	https://drive.google.com/file/d/157GNeqtsT9uYOBHoAjC5JJRiddTLRyn5/view
2nd papper	Videos	6.Power Electronics			Day 8 baishak 14.mp4.mp4	File	mp4	2nd papper/Videos/6.Power Electronics/	https://drive.google.com/file/d/1i5tGxrMAQ58O5-Dpj4chdlH3tPMJyUdH/view
2nd papper	Videos	6.Power Electronics			Day 9 baishak 15.mp4.mp4	File	mp4	2nd papper/Videos/6.Power Electronics/	https://drive.google.com/file/d/1zFBHZdxywS1ek8SSNsRhu4opTAldHWVt/view
2nd papper	Videos	6.Power Electronics			day 3 baishak 9.mp4.mp4	File	mp4	2nd papper/Videos/6.Power Electronics/	https://drive.google.com/file/d/17XGUnnWj1o-2SdbqQY1klHyxWU8VMlFt/view
2nd papper	Videos	9.Economics of Power Utilization			Day 1 baishak 20 ( morning ) .mp4.mp4	File	mp4	2nd papper/Videos/9.Economics of Power Utilization/	https://drive.google.com/file/d/1X-Z5qW10LDB5tuKg58iN_88X55QpMHW-/view
2nd papper	Videos	9.Economics of Power Utilization			Day 3 baishak 21 ( evening) .mp4.mp4	File	mp4	2nd papper/Videos/9.Economics of Power Utilization/	https://drive.google.com/file/d/1K8Dkd3B0URC9LyIW7kvjR6PhQ_efvJ8w/view
2nd papper	Videos	9.Economics of Power Utilization			Day 4 baishak 27.mp4.mp4	File	mp4	2nd papper/Videos/9.Economics of Power Utilization/	https://drive.google.com/file/d/1WuKeyD8YV_SRTKXtxi-ZzefRZj434qGs/view
2nd papper	Videos	9.Economics of Power Utilization			Day2 baishak 20 ( Evening ).mp4.mp4	File	mp4	2nd papper/Videos/9.Economics of Power Utilization/	https://drive.google.com/file/d/11ez_4AJWDOTliRlyAo9rN6ar4WCgt4fk/view
`;

function parseRaw(): Row[] {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const cols = line.split('\t').map((c) => c.trim());
      if (cols.length < 10) {
        throw new Error(`Invalid line (expected 10 cols): ${line}`);
      }
      return {
        level1: cols[0],
        level2: cols[1],
        level3: cols[2],
        level4: cols[3],
        level5: cols[4],
        fileName: cols[5],
        extension: cols[7],
        path: cols[8],
        link: cols[9],
      };
    });
}

async function getOrCreateFolder(name: string, parentId: string | null) {
  const existing = await prisma.folder.findFirst({
    where: { name, parentId },
  });
  if (existing) return existing.id;
  const created = await prisma.folder.create({
    data: {
      name,
      parentId,
    },
  });
  return created.id;
}

async function main() {
  const rows = parseRaw();
  const folderCache = new Map<string, string>();
  let createdFiles = 0;
  let skipped = 0;

  for (const row of rows) {
    if (!row.link.includes('drive.google.com')) {
      console.warn(`Skipping non-drive link: ${row.fileName}`);
      skipped++;
      continue;
    }
    const ext = row.extension.toLowerCase();
    const fileType: FileType | null = ext.includes('mp4') ? FileType.VIDEO : ext.includes('pdf') ? FileType.PDF : null;
    if (!fileType) {
      console.warn(`Skipping unsupported file type (${row.extension}): ${row.fileName}`);
      skipped++;
      continue;
    }

    const folderNames = row.path.split('/').filter(Boolean);
    let parentId: string | null = null;
    let pathKey = '';
    for (const name of folderNames) {
      pathKey = pathKey ? `${pathKey}/${name}` : name;
      if (folderCache.has(pathKey)) {
        parentId = folderCache.get(pathKey)!;
        continue;
      }
      const id = await getOrCreateFolder(name, parentId);
      folderCache.set(pathKey, id);
      parentId = id;
    }

    const existing = await prisma.file.findFirst({ where: { googleDriveUrl: row.link } });
    if (existing) {
      await prisma.file.update({
        where: { id: existing.id },
        data: {
          name: row.fileName,
          fileType,
          folderId: parentId,
          description: null,
        },
      });
    } else {
      await prisma.file.create({
        data: {
          name: row.fileName,
          fileType,
          googleDriveUrl: row.link,
          folderId: parentId,
        },
      });
    }
    createdFiles++;
  }

  console.log(`Imported files: ${createdFiles}, skipped: ${skipped}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
