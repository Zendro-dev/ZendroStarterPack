--
-- PostgreSQL database dump
--

-- Dumped from database version 11.1
-- Dumped by pg_dump version 11.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: sciencedb
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO sciencedb;

--
-- Name: cultivars; Type: TABLE; Schema: public; Owner: sciencedb
--

CREATE TABLE public.cultivars (
    id integer NOT NULL,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone,
    description text,
    genotype text,
    taxon_id integer
);


ALTER TABLE public.cultivars OWNER TO sciencedb;

--
-- Name: cultivars_id_seq; Type: SEQUENCE; Schema: public; Owner: sciencedb
--

CREATE SEQUENCE public.cultivars_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.cultivars_id_seq OWNER TO sciencedb;

--
-- Name: cultivars_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sciencedb
--

ALTER SEQUENCE public.cultivars_id_seq OWNED BY public.cultivars.id;


--
-- Name: db_was_seeded; Type: TABLE; Schema: public; Owner: sciencedb
--

CREATE TABLE public.db_was_seeded (
    seeded integer
);


ALTER TABLE public.db_was_seeded OWNER TO sciencedb;

--
-- Name: field_plots; Type: TABLE; Schema: public; Owner: sciencedb
--

CREATE TABLE public.field_plots (
    id integer NOT NULL,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone,
    field_name text,
    latitude double precision,
    longitude double precision,
    location_code text,
    soil_treatment text
);


ALTER TABLE public.field_plots OWNER TO sciencedb;

--
-- Name: field_plots_id_seq; Type: SEQUENCE; Schema: public; Owner: sciencedb
--

CREATE SEQUENCE public.field_plots_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.field_plots_id_seq OWNER TO sciencedb;

--
-- Name: field_plots_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sciencedb
--

ALTER SEQUENCE public.field_plots_id_seq OWNED BY public.field_plots.id;


--
-- Name: individuals; Type: TABLE; Schema: public; Owner: sciencedb
--

CREATE TABLE public.individuals (
    id integer NOT NULL,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone,
    name text,
    sowing_date date,
    harvest_date date,
    developmental_state text,
    life_cycle_phase text,
    location_type text,
    cultivar_id integer,
    field_plot_id integer,
    pot_id integer
);


ALTER TABLE public.individuals OWNER TO sciencedb;

--
-- Name: individuals_id_seq; Type: SEQUENCE; Schema: public; Owner: sciencedb
--

CREATE SEQUENCE public.individuals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.individuals_id_seq OWNER TO sciencedb;

--
-- Name: individuals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sciencedb
--

ALTER SEQUENCE public.individuals_id_seq OWNED BY public.individuals.id;


--
-- Name: microbiome_asvs; Type: TABLE; Schema: public; Owner: sciencedb
--

CREATE TABLE public.microbiome_asvs (
    id integer NOT NULL,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone,
    asv_id text,
    compartment text,
    count integer,
    version integer,
    primer_kingdom text,
    sample_id integer,
    taxon_id integer
);


ALTER TABLE public.microbiome_asvs OWNER TO sciencedb;

--
-- Name: microbiome_asvs_id_seq; Type: SEQUENCE; Schema: public; Owner: sciencedb
--

CREATE SEQUENCE public.microbiome_asvs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.microbiome_asvs_id_seq OWNER TO sciencedb;

--
-- Name: microbiome_asvs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sciencedb
--

ALTER SEQUENCE public.microbiome_asvs_id_seq OWNED BY public.microbiome_asvs.id;


--
-- Name: plant_measurements; Type: TABLE; Schema: public; Owner: sciencedb
--

CREATE TABLE public.plant_measurements (
    id integer NOT NULL,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone,
    variable text,
    value double precision,
    unit text,
    individual_id integer
);


ALTER TABLE public.plant_measurements OWNER TO sciencedb;

--
-- Name: plant_measurements_id_seq; Type: SEQUENCE; Schema: public; Owner: sciencedb
--

CREATE SEQUENCE public.plant_measurements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.plant_measurements_id_seq OWNER TO sciencedb;

--
-- Name: plant_measurements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sciencedb
--

ALTER SEQUENCE public.plant_measurements_id_seq OWNED BY public.plant_measurements.id;


--
-- Name: pots; Type: TABLE; Schema: public; Owner: sciencedb
--

CREATE TABLE public.pots (
    id integer NOT NULL,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone,
    pot text,
    greenhouse text,
    climate_chamber text,
    conditions text
);


ALTER TABLE public.pots OWNER TO sciencedb;

--
-- Name: pots_id_seq; Type: SEQUENCE; Schema: public; Owner: sciencedb
--

CREATE SEQUENCE public.pots_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pots_id_seq OWNER TO sciencedb;

--
-- Name: pots_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sciencedb
--

ALTER SEQUENCE public.pots_id_seq OWNED BY public.pots.id;


--
-- Name: role_to_user; Type: TABLE; Schema: public; Owner: sciencedb
--

CREATE TABLE public.role_to_user (
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone,
    "userId" integer,
    "roleId" integer
);


ALTER TABLE public.role_to_user OWNER TO sciencedb;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: sciencedb
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone,
    name text,
    description text
);


ALTER TABLE public.roles OWNER TO sciencedb;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: sciencedb
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.roles_id_seq OWNER TO sciencedb;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sciencedb
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: sample_measurements; Type: TABLE; Schema: public; Owner: sciencedb
--

CREATE TABLE public.sample_measurements (
    id integer NOT NULL,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone,
    variable text,
    value double precision,
    unit text,
    "CAS_number" text,
    description text,
    sample_id integer
);


ALTER TABLE public.sample_measurements OWNER TO sciencedb;

--
-- Name: sample_measurements_id_seq; Type: SEQUENCE; Schema: public; Owner: sciencedb
--

CREATE SEQUENCE public.sample_measurements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sample_measurements_id_seq OWNER TO sciencedb;

--
-- Name: sample_measurements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sciencedb
--

ALTER SEQUENCE public.sample_measurements_id_seq OWNED BY public.sample_measurements.id;


--
-- Name: samples; Type: TABLE; Schema: public; Owner: sciencedb
--

CREATE TABLE public.samples (
    id integer NOT NULL,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone,
    name text,
    material text,
    life_cycle_phase text,
    description text,
    harvest_date date,
    library text,
    barcode_number integer,
    barcode_sequence text,
    sample_id integer,
    individual_id integer,
    pot_id integer,
    field_plot_id integer
);


ALTER TABLE public.samples OWNER TO sciencedb;

--
-- Name: samples_id_seq; Type: SEQUENCE; Schema: public; Owner: sciencedb
--

CREATE SEQUENCE public.samples_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.samples_id_seq OWNER TO sciencedb;

--
-- Name: samples_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sciencedb
--

ALTER SEQUENCE public.samples_id_seq OWNED BY public.samples.id;


--
-- Name: taxons; Type: TABLE; Schema: public; Owner: sciencedb
--

CREATE TABLE public.taxons (
    id integer NOT NULL,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone,
    name text,
    taxonomic_level text,
    reference_sequence text,
    reference_gene text,
    taxon_id integer
);


ALTER TABLE public.taxons OWNER TO sciencedb;

--
-- Name: taxons_id_seq; Type: SEQUENCE; Schema: public; Owner: sciencedb
--

CREATE SEQUENCE public.taxons_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.taxons_id_seq OWNER TO sciencedb;

--
-- Name: taxons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sciencedb
--

ALTER SEQUENCE public.taxons_id_seq OWNED BY public.taxons.id;


--
-- Name: transcript_counts; Type: TABLE; Schema: public; Owner: sciencedb
--

CREATE TABLE public.transcript_counts (
    id integer NOT NULL,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone,
    gene text,
    variable text,
    count double precision,
    tissue_or_condition text,
    individual_id integer
);


ALTER TABLE public.transcript_counts OWNER TO sciencedb;

--
-- Name: transcript_counts_id_seq; Type: SEQUENCE; Schema: public; Owner: sciencedb
--

CREATE SEQUENCE public.transcript_counts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.transcript_counts_id_seq OWNER TO sciencedb;

--
-- Name: transcript_counts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sciencedb
--

ALTER SEQUENCE public.transcript_counts_id_seq OWNED BY public.transcript_counts.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: sciencedb
--

CREATE TABLE public.users (
    id integer NOT NULL,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone,
    email text,
    password text
);


ALTER TABLE public.users OWNER TO sciencedb;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: sciencedb
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO sciencedb;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sciencedb
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: cultivars id; Type: DEFAULT; Schema: public; Owner: sciencedb
--

ALTER TABLE ONLY public.cultivars ALTER COLUMN id SET DEFAULT nextval('public.cultivars_id_seq'::regclass);


--
-- Name: field_plots id; Type: DEFAULT; Schema: public; Owner: sciencedb
--

ALTER TABLE ONLY public.field_plots ALTER COLUMN id SET DEFAULT nextval('public.field_plots_id_seq'::regclass);


--
-- Name: individuals id; Type: DEFAULT; Schema: public; Owner: sciencedb
--

ALTER TABLE ONLY public.individuals ALTER COLUMN id SET DEFAULT nextval('public.individuals_id_seq'::regclass);


--
-- Name: microbiome_asvs id; Type: DEFAULT; Schema: public; Owner: sciencedb
--

ALTER TABLE ONLY public.microbiome_asvs ALTER COLUMN id SET DEFAULT nextval('public.microbiome_asvs_id_seq'::regclass);


--
-- Name: plant_measurements id; Type: DEFAULT; Schema: public; Owner: sciencedb
--

ALTER TABLE ONLY public.plant_measurements ALTER COLUMN id SET DEFAULT nextval('public.plant_measurements_id_seq'::regclass);


--
-- Name: pots id; Type: DEFAULT; Schema: public; Owner: sciencedb
--

ALTER TABLE ONLY public.pots ALTER COLUMN id SET DEFAULT nextval('public.pots_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: sciencedb
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: sample_measurements id; Type: DEFAULT; Schema: public; Owner: sciencedb
--

ALTER TABLE ONLY public.sample_measurements ALTER COLUMN id SET DEFAULT nextval('public.sample_measurements_id_seq'::regclass);


--
-- Name: samples id; Type: DEFAULT; Schema: public; Owner: sciencedb
--

ALTER TABLE ONLY public.samples ALTER COLUMN id SET DEFAULT nextval('public.samples_id_seq'::regclass);


--
-- Name: taxons id; Type: DEFAULT; Schema: public; Owner: sciencedb
--

ALTER TABLE ONLY public.taxons ALTER COLUMN id SET DEFAULT nextval('public.taxons_id_seq'::regclass);


--
-- Name: transcript_counts id; Type: DEFAULT; Schema: public; Owner: sciencedb
--

ALTER TABLE ONLY public.transcript_counts ALTER COLUMN id SET DEFAULT nextval('public.transcript_counts_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: sciencedb
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: sciencedb
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: cultivars cultivars_pkey; Type: CONSTRAINT; Schema: public; Owner: sciencedb
--

ALTER TABLE ONLY public.cultivars
    ADD CONSTRAINT cultivars_pkey PRIMARY KEY (id);


--
-- Name: field_plots field_plots_pkey; Type: CONSTRAINT; Schema: public; Owner: sciencedb
--

ALTER TABLE ONLY public.field_plots
    ADD CONSTRAINT field_plots_pkey PRIMARY KEY (id);


--
-- Name: individuals individuals_pkey; Type: CONSTRAINT; Schema: public; Owner: sciencedb
--

ALTER TABLE ONLY public.individuals
    ADD CONSTRAINT individuals_pkey PRIMARY KEY (id);


--
-- Name: microbiome_asvs microbiome_asvs_pkey; Type: CONSTRAINT; Schema: public; Owner: sciencedb
--

ALTER TABLE ONLY public.microbiome_asvs
    ADD CONSTRAINT microbiome_asvs_pkey PRIMARY KEY (id);


--
-- Name: plant_measurements plant_measurements_pkey; Type: CONSTRAINT; Schema: public; Owner: sciencedb
--

ALTER TABLE ONLY public.plant_measurements
    ADD CONSTRAINT plant_measurements_pkey PRIMARY KEY (id);


--
-- Name: pots pots_pkey; Type: CONSTRAINT; Schema: public; Owner: sciencedb
--

ALTER TABLE ONLY public.pots
    ADD CONSTRAINT pots_pkey PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: sciencedb
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: sample_measurements sample_measurements_pkey; Type: CONSTRAINT; Schema: public; Owner: sciencedb
--

ALTER TABLE ONLY public.sample_measurements
    ADD CONSTRAINT sample_measurements_pkey PRIMARY KEY (id);


--
-- Name: samples samples_pkey; Type: CONSTRAINT; Schema: public; Owner: sciencedb
--

ALTER TABLE ONLY public.samples
    ADD CONSTRAINT samples_pkey PRIMARY KEY (id);


--
-- Name: taxons taxons_pkey; Type: CONSTRAINT; Schema: public; Owner: sciencedb
--

ALTER TABLE ONLY public.taxons
    ADD CONSTRAINT taxons_pkey PRIMARY KEY (id);


--
-- Name: transcript_counts transcript_counts_pkey; Type: CONSTRAINT; Schema: public; Owner: sciencedb
--

ALTER TABLE ONLY public.transcript_counts
    ADD CONSTRAINT transcript_counts_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: sciencedb
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: role_to_user_role_id; Type: INDEX; Schema: public; Owner: sciencedb
--

CREATE INDEX role_to_user_role_id ON public.role_to_user USING btree ("roleId");


--
-- Name: role_to_user_user_id; Type: INDEX; Schema: public; Owner: sciencedb
--

CREATE INDEX role_to_user_user_id ON public.role_to_user USING btree ("userId");


--
-- Name: role_to_user role_to_user_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sciencedb
--

ALTER TABLE ONLY public.role_to_user
    ADD CONSTRAINT "role_to_user_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: role_to_user role_to_user_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sciencedb
--

ALTER TABLE ONLY public.role_to_user
    ADD CONSTRAINT "role_to_user_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

