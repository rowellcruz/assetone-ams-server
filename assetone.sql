--
-- PostgreSQL database dump
--

\restrict hAVI5WeOMcgpiinXtysgGwqmE1PapKeFRYbLDnMH0IYWZ4Ozg9Kg5Fzxu1fJvA5

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: procurement_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.procurement_status AS ENUM (
    'for_approval',
    'cancelled',
    'processing',
    'completed'
);


ALTER TYPE public.procurement_status OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: asset_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset_categories (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by integer,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by integer,
    deleted_at timestamp with time zone,
    deleted_by integer,
    code character varying
);


ALTER TABLE public.asset_categories OWNER TO postgres;

--
-- Name: asset_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.asset_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.asset_categories_id_seq OWNER TO postgres;

--
-- Name: asset_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.asset_categories_id_seq OWNED BY public.asset_categories.id;


--
-- Name: asset_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset_requests (
    id integer NOT NULL,
    request_id integer NOT NULL,
    sub_location_id integer NOT NULL,
    asset_id integer NOT NULL,
    quantity integer,
    requester_email character varying(255) NOT NULL,
    urgency integer NOT NULL,
    impact integer NOT NULL,
    description text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL
);


ALTER TABLE public.asset_requests OWNER TO postgres;

--
-- Name: asset_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.asset_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.asset_requests_id_seq OWNER TO postgres;

--
-- Name: asset_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.asset_requests_id_seq OWNED BY public.asset_requests.id;


--
-- Name: asset_units; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset_units (
    id integer NOT NULL,
    asset_id integer,
    brand character varying(100),
    lifecycle_status text DEFAULT 'active'::text,
    operational_status text DEFAULT 'available'::text,
    condition smallint NOT NULL,
    unit_tag character varying(255),
    serial_number character varying(255),
    acquisition_cost numeric(10,2) DEFAULT 0.00,
    useful_life_years integer DEFAULT 0,
    depreciation_method text,
    depreciation_rate numeric(5,4) NOT NULL,
    acquisition_date timestamp with time zone,
    department_id integer,
    sub_location_id integer,
    vendor_id integer,
    assigned_user_id integer,
    is_legacy boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by integer,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by integer,
    deleted_at timestamp with time zone,
    deleted_by integer,
    CONSTRAINT asset_units_depreciation_method_check CHECK ((depreciation_method = ANY (ARRAY['straight_line'::text, 'declining_balance'::text]))),
    CONSTRAINT asset_units_lifecycle_status_check CHECK ((lifecycle_status = ANY (ARRAY['active'::text, 'retired'::text, 'disposed'::text, 'lost'::text]))),
    CONSTRAINT asset_units_operational_status_check CHECK ((operational_status = ANY (ARRAY['available'::text, 'in_use'::text, 'on_stock'::text, 'transferred'::text, 'under_inspection'::text, 'under_investigation'::text, 'under_repair'::text, 'repaired'::text, 'for_repair'::text, 'broken'::text])))
);


ALTER TABLE public.asset_units OWNER TO postgres;

--
-- Name: asset_units_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.asset_units_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.asset_units_id_seq OWNER TO postgres;

--
-- Name: asset_units_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.asset_units_id_seq OWNED BY public.asset_units.id;


--
-- Name: assets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assets (
    id integer NOT NULL,
    type character varying(100) NOT NULL,
    created_by integer,
    updated_by integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    is_deleted boolean DEFAULT false,
    deleted_at timestamp with time zone,
    deleted_by integer,
    category_id integer,
    department_id integer
);


ALTER TABLE public.assets OWNER TO postgres;

--
-- Name: assets_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.assets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.assets_id_seq OWNER TO postgres;

--
-- Name: assets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.assets_id_seq OWNED BY public.assets.id;


--
-- Name: attachments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attachments (
    id integer NOT NULL,
    task_id integer NOT NULL,
    file_url text NOT NULL,
    filename character varying(255) NOT NULL,
    mime_type character varying(100),
    uploaded_by integer,
    uploaded_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    module character varying(50)
);


ALTER TABLE public.attachments OWNER TO postgres;

--
-- Name: completion_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.completion_requests (
    id integer NOT NULL,
    schedule_occurrence_id integer NOT NULL,
    requested_by integer NOT NULL,
    requested_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    approved_by integer,
    approved_at timestamp with time zone,
    status text DEFAULT 'pending'::text,
    notes text,
    CONSTRAINT completion_requests_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text])))
);


ALTER TABLE public.completion_requests OWNER TO postgres;

--
-- Name: completion_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.completion_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.completion_requests_id_seq OWNER TO postgres;

--
-- Name: completion_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.completion_requests_id_seq OWNED BY public.completion_requests.id;


--
-- Name: purchase_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchase_requests (
    id bigint NOT NULL,
    department_id bigint NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    requested_by bigint,
    request_id bigint
);


ALTER TABLE public.purchase_requests OWNER TO postgres;

--
-- Name: department_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.department_requests_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.department_requests_id_seq OWNER TO postgres;

--
-- Name: department_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.department_requests_id_seq OWNED BY public.purchase_requests.id;


--
-- Name: departments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.departments (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by integer,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by integer,
    deleted_at timestamp with time zone,
    deleted_by integer,
    code character varying
);


ALTER TABLE public.departments OWNER TO postgres;

--
-- Name: departments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.departments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.departments_id_seq OWNER TO postgres;

--
-- Name: departments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.departments_id_seq OWNED BY public.departments.id;


--
-- Name: issue_reports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.issue_reports (
    id integer NOT NULL,
    request_id integer NOT NULL,
    asset_id integer NOT NULL,
    asset_unit_id integer,
    reporter_email character varying(255) NOT NULL,
    urgency integer NOT NULL,
    impact integer NOT NULL,
    description text NOT NULL
);


ALTER TABLE public.issue_reports OWNER TO postgres;

--
-- Name: issue_reports_issue_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.issue_reports_issue_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.issue_reports_issue_id_seq OWNER TO postgres;

--
-- Name: issue_reports_issue_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.issue_reports_issue_id_seq OWNED BY public.issue_reports.id;


--
-- Name: locations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.locations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by integer,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by integer,
    deleted_at timestamp with time zone,
    deleted_by integer
);


ALTER TABLE public.locations OWNER TO postgres;

--
-- Name: locations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.locations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.locations_id_seq OWNER TO postgres;

--
-- Name: locations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.locations_id_seq OWNED BY public.locations.id;


--
-- Name: password_reset_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.password_reset_requests (
    id integer NOT NULL,
    user_id integer NOT NULL,
    status text DEFAULT 'pending'::text,
    requested_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    approved_by integer,
    approved_at timestamp with time zone,
    CONSTRAINT password_reset_requests_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text])))
);


ALTER TABLE public.password_reset_requests OWNER TO postgres;

--
-- Name: password_reset_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.password_reset_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.password_reset_requests_id_seq OWNER TO postgres;

--
-- Name: password_reset_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.password_reset_requests_id_seq OWNED BY public.password_reset_requests.id;


--
-- Name: procurement_finalizations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.procurement_finalizations (
    id integer NOT NULL,
    task_id integer NOT NULL,
    final_cost_per_unit numeric(12,2) NOT NULL,
    final_vendor_id integer,
    final_brand character varying(255),
    useful_life_years integer NOT NULL,
    depreciation_method character varying(50) NOT NULL,
    depreciation_rate numeric(6,2) NOT NULL,
    finalized_by integer,
    finalized_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT procurement_finalizations_depreciation_method_check CHECK (((depreciation_method)::text = ANY ((ARRAY['straight_line'::character varying, 'declining_balance'::character varying])::text[])))
);


ALTER TABLE public.procurement_finalizations OWNER TO postgres;

--
-- Name: procurement_finalizations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.procurement_finalizations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.procurement_finalizations_id_seq OWNER TO postgres;

--
-- Name: procurement_finalizations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.procurement_finalizations_id_seq OWNED BY public.procurement_finalizations.id;


--
-- Name: procurement_task_attachments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.procurement_task_attachments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.procurement_task_attachments_id_seq OWNER TO postgres;

--
-- Name: procurement_task_attachments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.procurement_task_attachments_id_seq OWNED BY public.attachments.id;


--
-- Name: procurement_tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.procurement_tasks (
    id integer NOT NULL,
    asset_id integer NOT NULL,
    quantity integer NOT NULL,
    estimated_cost_per_unit numeric(12,2) NOT NULL,
    total_cost numeric(14,2) GENERATED ALWAYS AS (((quantity)::numeric * estimated_cost_per_unit)) STORED,
    description text,
    created_by integer NOT NULL,
    updated_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status public.procurement_status DEFAULT 'for_approval'::public.procurement_status NOT NULL
);


ALTER TABLE public.procurement_tasks OWNER TO postgres;

--
-- Name: procurement_tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.procurement_tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.procurement_tasks_id_seq OWNER TO postgres;

--
-- Name: procurement_tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.procurement_tasks_id_seq OWNED BY public.procurement_tasks.id;


--
-- Name: requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.requests (
    id integer NOT NULL,
    request_type character varying(20) NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    approved_at timestamp with time zone,
    approved_by integer,
    rejected_at timestamp with time zone,
    rejected_by integer,
    CONSTRAINT chk_request_type CHECK (((request_type)::text = ANY (ARRAY['issue'::text, 'asset'::text, 'account'::text, 'purchase'::text])))
);


ALTER TABLE public.requests OWNER TO postgres;

--
-- Name: requests_request_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.requests_request_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.requests_request_id_seq OWNER TO postgres;

--
-- Name: requests_request_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.requests_request_id_seq OWNED BY public.requests.id;


--
-- Name: schedule_occurrences; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.schedule_occurrences (
    id integer NOT NULL,
    template_id integer NOT NULL,
    scheduled_date timestamp with time zone NOT NULL,
    completed_at timestamp with time zone,
    completed_by integer,
    skipped_at timestamp with time zone,
    skipped_by integer,
    skipped_reason text,
    skipped_context text,
    status text DEFAULT 'pending'::text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    started_at timestamp with time zone,
    started_by integer,
    reviewed_at timestamp without time zone,
    reviewed_by integer,
    review_remarks text,
    CONSTRAINT schedule_occurrences_skipped_context_check CHECK ((skipped_context = ANY (ARRAY['pending'::text, 'overdue'::text]))),
    CONSTRAINT schedule_occurrences_status_check CHECK ((status = ANY (ARRAY['active'::text, 'completed'::text, 'pending'::text, 'in_progress'::text, 'skipped'::text, 'overdue'::text, 'in_completion_request'::text])))
);


ALTER TABLE public.schedule_occurrences OWNER TO postgres;

--
-- Name: schedule_occurrences_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.schedule_occurrences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.schedule_occurrences_id_seq OWNER TO postgres;

--
-- Name: schedule_occurrences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.schedule_occurrences_id_seq OWNED BY public.schedule_occurrences.id;


--
-- Name: schedule_technicians; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.schedule_technicians (
    schedule_occurrence_id integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.schedule_technicians OWNER TO postgres;

--
-- Name: schedule_template_assets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.schedule_template_assets (
    schedule_occurrence_id integer NOT NULL,
    asset_unit_id integer NOT NULL
);


ALTER TABLE public.schedule_template_assets OWNER TO postgres;

--
-- Name: schedule_templates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.schedule_templates (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    type text NOT NULL,
    frequency_value integer,
    frequency_unit text,
    start_date timestamp with time zone,
    status text DEFAULT 'active'::text,
    expiration_date date,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by integer NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by integer,
    deleted_at timestamp with time zone,
    deleted_by integer,
    asset_id integer,
    grace_period_value integer DEFAULT 0,
    grace_period_unit text DEFAULT 'days'::text,
    CONSTRAINT schedule_templates_frequency_unit_check CHECK ((frequency_unit = ANY (ARRAY['days'::text, 'weeks'::text, 'months'::text]))),
    CONSTRAINT schedule_templates_grace_period_unit_check CHECK ((grace_period_unit = ANY (ARRAY['hours'::text, 'days'::text]))),
    CONSTRAINT schedule_templates_status_check CHECK ((status = ANY (ARRAY['active'::text, 'paused'::text, 'stopped'::text]))),
    CONSTRAINT schedule_templates_type_check CHECK ((type = ANY (ARRAY['CM'::text, 'PM'::text])))
);


ALTER TABLE public.schedule_templates OWNER TO postgres;

--
-- Name: schedule_templates_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.schedule_templates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.schedule_templates_id_seq OWNER TO postgres;

--
-- Name: schedule_templates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.schedule_templates_id_seq OWNED BY public.schedule_templates.id;


--
-- Name: sub_location_assets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sub_location_assets (
    id bigint NOT NULL,
    sub_location_id bigint NOT NULL,
    quantity integer NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    asset_id bigint,
    CONSTRAINT sub_location_assets_quantity_check CHECK ((quantity >= 0))
);


ALTER TABLE public.sub_location_assets OWNER TO postgres;

--
-- Name: sub_location_assets_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sub_location_assets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sub_location_assets_id_seq OWNER TO postgres;

--
-- Name: sub_location_assets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sub_location_assets_id_seq OWNED BY public.sub_location_assets.id;


--
-- Name: sub_locations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sub_locations (
    id integer NOT NULL,
    location_id integer NOT NULL,
    name character varying(100) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by integer,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by integer,
    deleted_at timestamp with time zone,
    deleted_by integer
);


ALTER TABLE public.sub_locations OWNER TO postgres;

--
-- Name: sub_locations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sub_locations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sub_locations_id_seq OWNER TO postgres;

--
-- Name: sub_locations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sub_locations_id_seq OWNED BY public.sub_locations.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    first_name character varying(100),
    last_name character varying(100),
    email character varying(100),
    password character varying(255),
    role text NOT NULL,
    secondary_email character varying(100),
    department_id integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by integer,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by integer,
    deleted_at timestamp with time zone,
    deleted_by integer,
    status character varying(50),
    disabled_at timestamp without time zone,
    disabled_by integer,
    CONSTRAINT users_role_check CHECK ((role = ANY (ARRAY['system_administrator'::text, 'gso_head'::text, 'property_custodian'::text, 'technician'::text]))),
    CONSTRAINT users_status_check CHECK (((status)::text = ANY (ARRAY[('active'::character varying)::text, ('inactive'::character varying)::text, ('in operation'::character varying)::text, ('disabled'::character varying)::text, ('deleted'::character varying)::text])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: vendor_offers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vendor_offers (
    vendor_id integer NOT NULL,
    asset_category_id integer NOT NULL
);


ALTER TABLE public.vendor_offers OWNER TO postgres;

--
-- Name: vendors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vendors (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    address character varying(255),
    contact_person character varying(100),
    email_address character varying(100),
    phone_number character varying(20),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by integer,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by integer,
    deleted_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_by integer
);


ALTER TABLE public.vendors OWNER TO postgres;

--
-- Name: vendors_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vendors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vendors_id_seq OWNER TO postgres;

--
-- Name: vendors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vendors_id_seq OWNED BY public.vendors.id;


--
-- Name: asset_categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_categories ALTER COLUMN id SET DEFAULT nextval('public.asset_categories_id_seq'::regclass);


--
-- Name: asset_requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_requests ALTER COLUMN id SET DEFAULT nextval('public.asset_requests_id_seq'::regclass);


--
-- Name: asset_units id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_units ALTER COLUMN id SET DEFAULT nextval('public.asset_units_id_seq'::regclass);


--
-- Name: assets id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets ALTER COLUMN id SET DEFAULT nextval('public.assets_id_seq'::regclass);


--
-- Name: attachments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attachments ALTER COLUMN id SET DEFAULT nextval('public.procurement_task_attachments_id_seq'::regclass);


--
-- Name: completion_requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.completion_requests ALTER COLUMN id SET DEFAULT nextval('public.completion_requests_id_seq'::regclass);


--
-- Name: departments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments ALTER COLUMN id SET DEFAULT nextval('public.departments_id_seq'::regclass);


--
-- Name: issue_reports id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.issue_reports ALTER COLUMN id SET DEFAULT nextval('public.issue_reports_issue_id_seq'::regclass);


--
-- Name: locations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations ALTER COLUMN id SET DEFAULT nextval('public.locations_id_seq'::regclass);


--
-- Name: password_reset_requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_requests ALTER COLUMN id SET DEFAULT nextval('public.password_reset_requests_id_seq'::regclass);


--
-- Name: procurement_finalizations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procurement_finalizations ALTER COLUMN id SET DEFAULT nextval('public.procurement_finalizations_id_seq'::regclass);


--
-- Name: procurement_tasks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procurement_tasks ALTER COLUMN id SET DEFAULT nextval('public.procurement_tasks_id_seq'::regclass);


--
-- Name: purchase_requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_requests ALTER COLUMN id SET DEFAULT nextval('public.department_requests_id_seq'::regclass);


--
-- Name: requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests ALTER COLUMN id SET DEFAULT nextval('public.requests_request_id_seq'::regclass);


--
-- Name: schedule_occurrences id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedule_occurrences ALTER COLUMN id SET DEFAULT nextval('public.schedule_occurrences_id_seq'::regclass);


--
-- Name: schedule_templates id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedule_templates ALTER COLUMN id SET DEFAULT nextval('public.schedule_templates_id_seq'::regclass);


--
-- Name: sub_location_assets id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sub_location_assets ALTER COLUMN id SET DEFAULT nextval('public.sub_location_assets_id_seq'::regclass);


--
-- Name: sub_locations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sub_locations ALTER COLUMN id SET DEFAULT nextval('public.sub_locations_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: vendors id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendors ALTER COLUMN id SET DEFAULT nextval('public.vendors_id_seq'::regclass);


--
-- Data for Name: asset_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asset_categories (id, name, description, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by, code) FROM stdin;
1	School suppliess	\N	2025-10-08 19:07:11.670438+08	4	2025-10-09 13:20:40.101+08	4	\N	\N	\N
2	Vehicles	\N	2025-10-08 19:25:32.815624+08	4	2025-10-09 13:20:43.597+08	4	\N	\N	\N
3	bbbb	\N	2025-10-14 10:25:22.938577+08	4	2025-10-14 10:25:22.938577+08	\N	\N	\N	\N
5	qweqweqwe	\N	2025-10-14 19:38:56.159307+08	4	2025-10-14 19:38:56.159307+08	\N	\N	\N	QWEE
4	Awdas	\N	2025-10-14 10:28:10.041281+08	4	2025-10-16 18:06:15.428+08	4	\N	\N	qwe
\.


--
-- Data for Name: asset_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asset_requests (id, request_id, sub_location_id, asset_id, quantity, requester_email, urgency, impact, description, created_at, status) FROM stdin;
\.


--
-- Data for Name: asset_units; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asset_units (id, asset_id, brand, lifecycle_status, operational_status, condition, unit_tag, serial_number, acquisition_cost, useful_life_years, depreciation_method, depreciation_rate, acquisition_date, department_id, sub_location_id, vendor_id, assigned_user_id, is_legacy, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by) FROM stdin;
\.


--
-- Data for Name: assets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.assets (id, type, created_by, updated_by, created_at, updated_at, is_deleted, deleted_at, deleted_by, category_id, department_id) FROM stdin;
5	Router	1	1	2025-08-26 20:06:06.252115+08	2025-08-26 20:06:06.252115+08	f	\N	\N	\N	7
8	Camera	1	1	2025-08-26 20:06:06.252115+08	2025-08-26 20:06:06.252115+08	f	\N	\N	\N	7
7	Tablet	1	4	2025-08-26 20:06:06.252115+08	2025-10-09 09:53:19.614+08	f	\N	\N	\N	7
15	Papers	4	4	2025-10-08 21:57:17.567743+08	2025-10-09 16:37:33.427+08	t	\N	\N	\N	7
10	Speakers	1	4	2025-08-26 20:06:06.252115+08	2025-10-09 16:41:55.643+08	f	\N	\N	\N	7
4	Scanner	1	4	2025-08-26 20:06:06.252115+08	2025-10-10 20:01:33.411+08	f	2025-10-10 20:01:33.411+08	4	\N	7
3	Printer	1	4	2025-08-26 20:06:06.252115+08	2025-10-10 20:06:52.612+08	f	\N	\N	\N	7
6	Desktop PC	1	4	2025-08-26 20:06:06.252115+08	2025-10-10 20:07:01.356+08	f	\N	\N	\N	7
16	Papers	4	4	2025-10-10 20:38:44.244017+08	2025-10-10 20:38:44.244017+08	f	\N	\N	\N	7
17	AAAA	4	4	2025-10-10 20:43:37.995942+08	2025-10-10 21:39:54.824+08	f	\N	\N	1	11
18	qweqwe	4	4	2025-10-14 10:30:02.997244+08	2025-10-14 10:37:25.421+08	f	\N	\N	4	13
\.


--
-- Data for Name: attachments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attachments (id, task_id, file_url, filename, mime_type, uploaded_by, uploaded_at, module) FROM stdin;
107	17	1759621473897-974520265.pdf	dyci-voc2-ChinesePinyinEnglish (1).pdf	application/pdf	4	2025-10-05 07:44:33.9719+08	finance_approval
108	17	1759621522706-104868229.docx	assetone-chapter-1-3 (1) (1).docx	application/vnd.openxmlformats-officedocument.wordprocessingml.document	4	2025-10-05 07:45:22.821086+08	finalize_acquisition
109	17	1759621532362-944973477.docx	assetone-chapter-1-3 (1) (1).docx	application/vnd.openxmlformats-officedocument.wordprocessingml.document	4	2025-10-05 07:45:32.449447+08	finalize_acquisition
110	17	1759621543684-63313482.docx	assetone-chapter-1-3 (1) (1).docx	application/vnd.openxmlformats-officedocument.wordprocessingml.document	4	2025-10-05 07:45:43.747572+08	finalize_acquisition
111	18	1759622891941-389639495.docx	Archive_Final-updated - Copy.docx	application/vnd.openxmlformats-officedocument.wordprocessingml.document	4	2025-10-05 08:08:11.97896+08	finance_approval
112	19	1759622920768-120790361.docx	dyci-voc2-ChinesePinyinEnglish (1).docx	application/vnd.openxmlformats-officedocument.wordprocessingml.document	4	2025-10-05 08:08:40.770254+08	finance_approval
113	20	1759625017160-694038381.docx	Alexa_vocabulary-assessment-template - Copy (1).docx	application/vnd.openxmlformats-officedocument.wordprocessingml.document	4	2025-10-05 08:43:37.208003+08	finance_approval
114	21	1759625291754-410050662.docx	dyci-voc2-ChinesePinyinEnglish (1).docx	application/vnd.openxmlformats-officedocument.wordprocessingml.document	4	2025-10-05 08:48:11.758092+08	finance_approval
115	21	1759625302909-960588238.docx	Alexa_vocabulary-assessment-template - Copy (1).docx	application/vnd.openxmlformats-officedocument.wordprocessingml.document	4	2025-10-05 08:48:22.913433+08	finalize_acquisition
116	22	1759625456135-95058093.docx	Alexa_vocabulary-assessment-template - Copy (1).docx	application/vnd.openxmlformats-officedocument.wordprocessingml.document	4	2025-10-05 08:50:56.157863+08	finance_approval
117	22	1759625462925-267280828.docx	Alexa_vocabulary-assessment-template - Copy (1).docx	application/vnd.openxmlformats-officedocument.wordprocessingml.document	4	2025-10-05 08:51:02.937057+08	finalize_acquisition
118	23	1759625995474-196151406.pdf	dyci-voc2-ChinesePinyinEnglish (1).pdf	application/pdf	4	2025-10-05 08:59:55.486441+08	finance_approval
119	23	1759626023688-179884290.docx	Ryan_vocabulary-assessment-template.docx	application/vnd.openxmlformats-officedocument.wordprocessingml.document	4	2025-10-05 09:00:23.695235+08	finalize_acquisition
\.


--
-- Data for Name: completion_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.completion_requests (id, schedule_occurrence_id, requested_by, requested_at, approved_by, approved_at, status, notes) FROM stdin;
\.


--
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.departments (id, name, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by, code) FROM stdin;
9	Registrar	2025-08-25 00:31:24.364384+08	1	2025-10-14 10:34:02.661+08	4	\N	\N	\N
13	qweqw	2025-10-14 10:37:16.758787+08	4	2025-10-14 10:37:16.758787+08	4	\N	\N	qweqe
7	Facilities Management	2025-08-25 00:31:24.364384+08	1	2025-08-25 00:31:24.364384+08	1	\N	\N	\N
8	Library	2025-08-25 00:31:24.364384+08	1	2025-08-25 00:31:24.364384+08	1	\N	\N	\N
10	Engineering	2025-08-25 00:31:24.364384+08	1	2025-08-25 00:31:24.364384+08	1	\N	\N	\N
11	Science Department	2025-08-25 00:31:24.364384+08	1	2025-08-25 00:31:24.364384+08	1	\N	\N	\N
\.


--
-- Data for Name: issue_reports; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.issue_reports (id, request_id, asset_id, asset_unit_id, reporter_email, urgency, impact, description) FROM stdin;
\.


--
-- Data for Name: locations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.locations (id, name, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by) FROM stdin;
3	Library	2025-08-25 00:31:47.998881+08	1	2025-08-25 00:31:47.998881+08	1	\N	\N
4	Sports Complex	2025-08-25 00:31:47.998881+08	1	2025-08-25 00:31:47.998881+08	1	\N	\N
5	Administration Building	2025-08-25 00:31:47.998881+08	1	2025-08-25 00:31:47.998881+08	1	\N	\N
1	Main Building	2025-08-25 00:31:47.998881+08	1	2025-08-25 00:40:01.847+08	1	\N	\N
2	Science Center	2025-08-25 00:31:47.998881+08	1	2025-08-29 10:00:57.359+08	1	\N	\N
6	qweqwe	2025-09-11 20:28:41.253744+08	1	2025-09-11 20:28:41.253744+08	\N	\N	\N
8	asdasd	2025-09-11 20:29:22.587569+08	1	2025-09-11 20:29:36.576+08	1	\N	\N
10	1231	2025-10-01 19:08:50.14387+08	1	2025-10-01 19:08:50.14387+08	1	\N	\N
\.


--
-- Data for Name: password_reset_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.password_reset_requests (id, user_id, status, requested_at, approved_by, approved_at) FROM stdin;
1	3	pending	2025-10-02 15:49:16.651537+08	\N	\N
\.


--
-- Data for Name: procurement_finalizations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.procurement_finalizations (id, task_id, final_cost_per_unit, final_vendor_id, final_brand, useful_life_years, depreciation_method, depreciation_rate, finalized_by, finalized_at) FROM stdin;
28	17	29000.00	\N	\N	5	straight_line	0.20	4	2025-10-05 07:45:43.766146
29	19	9000.00	\N	\N	5	straight_line	0.20	4	2025-10-05 08:08:53.124735
30	20	9000.00	\N	\N	5	straight_line	0.20	4	2025-10-05 08:43:42.018301
31	21	9000.00	\N	\N	5	straight_line	0.20	4	2025-10-05 08:48:22.929238
32	22	9000.00	\N	\N	5	straight_line	0.20	4	2025-10-05 08:51:02.954572
33	23	123123.00	\N	\N	5	straight_line	0.20	4	2025-10-05 09:00:23.712287
\.


--
-- Data for Name: procurement_tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.procurement_tasks (id, asset_id, quantity, estimated_cost_per_unit, description, created_by, updated_by, created_at, updated_at, status) FROM stdin;
17	3	25	25000.00	Need for stock	4	4	2025-10-05 07:07:15.621079	2025-10-04 23:45:43.834	completed
18	10	20	500.00	12	4	4	2025-10-05 08:08:02.776214	2025-10-05 00:08:15.555	cancelled
19	10	10	5000.00	123	4	4	2025-10-05 08:08:33.018928	2025-10-05 00:08:53.149	completed
20	4	5	123.00	123	4	4	2025-10-05 08:43:28.528867	2025-10-05 00:43:42.069	completed
21	5	5	599.00	123	4	4	2025-10-05 08:48:04.144535	2025-10-05 00:48:22.943	completed
22	7	10	123.00	123123	4	4	2025-10-05 08:50:48.816609	2025-10-05 00:51:02.981	completed
23	4	20	2000.00	123	4	4	2025-10-05 08:59:43.515585	2025-10-05 01:00:23.745	completed
\.


--
-- Data for Name: purchase_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchase_requests (id, department_id, created_at, updated_at, requested_by, request_id) FROM stdin;
\.


--
-- Data for Name: requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.requests (id, request_type, status, created_at, updated_at, deleted_at, approved_at, approved_by, rejected_at, rejected_by) FROM stdin;
133	purchase	pending	2025-10-02 16:22:53.784009+08	2025-10-02 16:22:53.784009+08	\N	\N	\N	\N	\N
134	purchase	pending	2025-10-05 07:38:56.582454+08	2025-10-05 07:38:56.582454+08	\N	\N	\N	\N	\N
135	purchase	pending	2025-10-05 07:43:19.537454+08	2025-10-05 07:43:19.537454+08	\N	\N	\N	\N	\N
136	purchase	approved	2025-10-05 07:44:03.100241+08	2025-10-05 08:04:41.594+08	\N	\N	\N	\N	\N
137	purchase	approved	2025-10-05 08:07:48.662605+08	2025-10-05 08:11:16.987+08	\N	\N	\N	\N	\N
138	purchase	pending	2025-10-05 08:23:52.601813+08	2025-10-05 08:23:52.601813+08	\N	\N	\N	\N	\N
139	purchase	approved	2025-10-05 08:24:38.198838+08	2025-10-05 08:24:46.42+08	\N	\N	\N	\N	\N
140	purchase	approved	2025-10-05 08:27:22.93452+08	2025-10-05 08:30:29.933+08	\N	\N	\N	\N	\N
141	purchase	approved	2025-10-05 08:31:29.302878+08	2025-10-05 08:31:36.243+08	\N	\N	\N	\N	\N
142	asset	approved	2025-10-05 08:34:27.594592+08	2025-10-05 08:34:27.594592+08	\N	\N	\N	\N	\N
143	asset	approved	2025-10-05 08:39:05.499835+08	2025-10-05 08:39:05.499835+08	\N	\N	\N	\N	\N
144	asset	approved	2025-10-05 08:39:38.874838+08	2025-10-05 08:39:38.874838+08	\N	\N	\N	\N	\N
145	purchase	approved	2025-10-05 08:51:44.620619+08	2025-10-05 08:52:00.456+08	\N	\N	\N	\N	\N
146	purchase	approved	2025-10-05 08:59:06.291708+08	2025-10-05 08:59:15.84+08	\N	\N	\N	\N	\N
147	purchase	approved	2025-10-05 08:59:25.812996+08	2025-10-05 09:00:30.596+08	\N	\N	\N	\N	\N
114	asset	approved	2025-09-26 15:22:38.22985+08	2025-09-26 15:22:38.22985+08	\N	\N	\N	\N	\N
115	asset	approved	2025-09-26 23:56:12.766428+08	2025-09-26 23:56:12.766428+08	\N	\N	\N	\N	\N
116	asset	approved	2025-10-01 20:25:02.97323+08	2025-10-01 20:25:02.97323+08	\N	\N	\N	\N	\N
\.


--
-- Data for Name: schedule_occurrences; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.schedule_occurrences (id, template_id, scheduled_date, completed_at, completed_by, skipped_at, skipped_by, skipped_reason, skipped_context, status, created_at, updated_at, started_at, started_by, reviewed_at, reviewed_by, review_remarks) FROM stdin;
64	71	2025-10-10 18:05:00+08	\N	\N	\N	\N	\N	\N	pending	2025-10-16 18:05:52.484325+08	2025-10-16 18:05:52.484325+08	\N	\N	\N	\N	\N
\.


--
-- Data for Name: schedule_technicians; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.schedule_technicians (schedule_occurrence_id, user_id) FROM stdin;
\.


--
-- Data for Name: schedule_template_assets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.schedule_template_assets (schedule_occurrence_id, asset_unit_id) FROM stdin;
\.


--
-- Data for Name: schedule_templates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.schedule_templates (id, title, description, type, frequency_value, frequency_unit, start_date, status, expiration_date, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by, asset_id, grace_period_value, grace_period_unit) FROM stdin;
71	qweq	qweqe	PM	5	weeks	2025-10-10 18:05:00+08	active	\N	2025-10-16 18:05:52.287392+08	4	2025-10-16 18:05:52.276+08	4	\N	\N	18	1	days
\.


--
-- Data for Name: sub_location_assets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sub_location_assets (id, sub_location_id, quantity, status, created_at, updated_at, asset_id) FROM stdin;
1	3	5	pending	2025-09-26 15:44:40.732442	2025-09-26 23:43:25.711	6
2	3	5	approved	2025-09-26 23:56:23.539218	2025-09-26 23:56:50.87	4
3	3	5	approved	2025-10-01 20:32:30.293347	2025-10-01 20:32:55.107	3
4	5	5	approved	2025-10-05 08:34:46.835962	2025-10-05 08:35:01.658	10
5	5	5	approved	2025-10-05 08:40:00.055207	2025-10-05 08:40:10.31	10
\.


--
-- Data for Name: sub_locations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sub_locations (id, location_id, name, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by) FROM stdin;
3	1	Room 103	2025-08-25 00:31:55.605475+08	1	2025-08-25 00:31:55.605475+08	1	\N	\N
4	2	Laboratory A	2025-08-25 00:31:55.605475+08	1	2025-08-25 00:31:55.605475+08	1	\N	\N
6	2	Lecture Hall 1	2025-08-25 00:31:55.605475+08	1	2025-08-25 00:31:55.605475+08	1	\N	\N
7	3	Reading Hall	2025-08-25 00:31:55.605475+08	1	2025-08-25 00:31:55.605475+08	1	\N	\N
8	3	Computer Section	2025-08-25 00:31:55.605475+08	1	2025-08-25 00:31:55.605475+08	1	\N	\N
9	3	Archives	2025-08-25 00:31:55.605475+08	1	2025-08-25 00:31:55.605475+08	1	\N	\N
10	4	Basketball Court	2025-08-25 00:31:55.605475+08	1	2025-08-25 00:31:55.605475+08	1	\N	\N
11	4	Fitness Gym	2025-08-25 00:31:55.605475+08	1	2025-08-25 00:31:55.605475+08	1	\N	\N
12	4	Locker Room	2025-08-25 00:31:55.605475+08	1	2025-08-25 00:31:55.605475+08	1	\N	\N
14	5	HR Office	2025-08-25 00:31:55.605475+08	1	2025-08-25 00:31:55.605475+08	1	\N	\N
5	2	Office of Registrarasd	2025-08-25 00:31:55.605475+08	1	2025-09-25 15:45:07.589+08	1	\N	\N
18	0	{"id":1758790324482,"name":"asd"}	2025-09-25 16:52:04.62636+08	\N	2025-09-25 16:52:04.62636+08	\N	\N	\N
26	5	qwe	2025-09-25 17:08:59.451163+08	\N	2025-09-25 17:08:59.451163+08	\N	\N	\N
30	10	123	2025-10-01 19:08:50.14387+08	1	2025-10-01 19:08:50.14387+08	1	\N	\N
31	10	213	2025-10-01 19:08:50.14387+08	1	2025-10-01 19:08:50.14387+08	1	\N	\N
1	1	Room 101	2025-08-25 00:31:55.605475+08	1	2025-10-09 15:56:48.186+08	4	2025-10-09 15:56:48.186+08	4
32	5	Aa	2025-10-09 15:58:43.954119+08	\N	2025-10-09 15:58:43.954119+08	\N	\N	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, first_name, last_name, email, password, role, secondary_email, department_id, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by, status, disabled_at, disabled_by) FROM stdin;
1	Rowell	Cruz	cruzrowellt11@gmail.com	$2b$10$cQShwOgKE/hU9wg/8hC4dexqJi5KRV5z6jNv8XhercWB.v138/mta	system_administrator	\N	\N	2025-08-25 00:31:33.322615+08	1	2025-08-25 00:31:33.322615+08	\N	\N	\N	inactive	\N	\N
4	Rowell	Cruz	oliver.tan@example.com	$2b$10$Uvv4Pgmrd6oaq24lSnwmWububA3h30kf3uJupgyjb.MrcYOT4N56G	gso_head	\N	\N	2025-08-25 00:31:33.322615+08	1	2025-10-07 22:57:12.845+08	1	\N	\N	inactive	\N	\N
18	Rowell	Cruz	abb.abb@example.com	$2b$10$KeYD/zn2k9GrSVt0RLsM9uytf0pzT4QljLbWxAnJXMeoLe.qdW4Fa	property_custodian	\N	9	2025-10-05 20:30:03.057163+08	\N	2025-10-05 20:30:03.057163+08	\N	\N	\N	inactive	\N	\N
5	Rowell	Cruz	sophia.lee@example.com	$2b$10$Uvv4Pgmrd6oaq24lSnwmWububA3h30kf3uJupgyjb.MrcYOT4N56G	gso_head	\N	\N	2025-08-25 00:31:33.322615+08	1	2025-08-25 00:31:33.322615+08	1	\N	\N	inactive	\N	\N
3	Rowell	Cruz	rowellcruz145@gmail.com	$2b$10$yWeASFVCcvinLcSRLGc9eOeyCJeLHhrvxNYRjGex4qE/TD9.2mWgW	gso_head	\N	1	2025-08-25 00:31:33.322615+08	\N	2025-08-25 00:31:33.322615+08	\N	\N	\N	inactive	\N	\N
10	Rowell	Cruz	peter.lopez@example.com	$2b$10$Uvv4Pgmrd6oaq24lSnwmWububA3h30kf3uJupgyjb.MrcYOT4N56G	technician	\N	\N	2025-08-25 00:31:33.322615+08	1	2025-08-25 00:31:33.322615+08	1	\N	\N	inactive	\N	\N
11	Rowell	Cruz	laura.martinez@example.com	$2b$10$Uvv4Pgmrd6oaq24lSnwmWububA3h30kf3uJupgyjb.MrcYOT4N56G	technician	\N	\N	2025-08-25 00:31:33.322615+08	1	2025-08-25 00:31:33.322615+08	1	\N	\N	inactive	\N	\N
8	Rowell	Cruz	john.reyes@example.com	$2b$10$Uvv4Pgmrd6oaq24lSnwmWububA3h30kf3uJupgyjb.MrcYOT4N56G	property_custodian	\N	1	2025-08-25 00:31:33.322615+08	1	2025-08-25 00:31:33.322615+08	1	\N	\N	inactive	\N	\N
9	Rowell	Cruz	maria.gonzalez@example.com	$2b$10$Uvv4Pgmrd6oaq24lSnwmWububA3h30kf3uJupgyjb.MrcYOT4N56G	property_custodian	\N	2	2025-08-25 00:31:33.322615+08	1	2025-08-25 00:31:33.322615+08	1	\N	\N	inactive	\N	\N
17	Rowell	Cruz	abc.123@example.com	$2b$10$WEnVIxfwe6yl.aHwwWTvOuY8mwVp9MdNp0oBfCYu0MMHxGb0z.J/W	property_custodian	\N	7	2025-10-05 20:28:40.825709+08	\N	2025-10-05 20:28:40.825709+08	\N	\N	\N	inactive	\N	\N
19	Rowell	Cruz	rowellcruz143@gmail.com	$2b$10$8ytN5vk.zB34240N9CgMfeVmQJmqaKoNHJzZO3rZby/KwtUdt3npC	technician	\N	\N	2025-10-07 18:39:52.793215+08	\N	2025-10-07 21:22:30.066+08	1	\N	\N	disabled	2025-10-07 13:22:30.066	1
\.


--
-- Data for Name: vendor_offers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vendor_offers (vendor_id, asset_category_id) FROM stdin;
8	1
2	1
2	2
9	1
9	2
4	1
4	2
7	2
7	1
\.


--
-- Data for Name: vendors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vendors (id, name, address, contact_person, email_address, phone_number, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by) FROM stdin;
5	Books & Beyond	12 Library St, Cityville	Elena Ramos	elena.ramos@booksandbeyond.com	0917-567-8901	2025-08-25 00:32:11.506681+08	1	2025-08-25 00:32:11.506681+08	1	2025-08-25 02:21:53.355335+08	\N
1	Tech Supplies Co.	123 Tech Street, Cityville	Alice Reyes	alice.reyes@techsupplies.com	0917-123-4567	2025-08-25 00:32:11.506681+08	1	2025-08-25 00:56:51.926+08	1	2025-08-25 02:21:53.355335+08	\N
8	asdasdaasd	321 Secure Lane, Safety Town, FL 33101qweqweqwe	Rowell Tenorio Cruz	cruzrowellt11@gmail.com	5554567890	2025-10-08 19:34:39.664776+08	4	2025-10-08 21:39:37.875+08	4	2025-10-08 19:34:39.664776+08	\N
3	LabTech Solutions	78 Science Blvd, Cityville	Carla Mendoza	carla.mendoza@labtech.com	0917-345-6789	2025-08-25 00:32:11.506681+08	1	2025-10-08 21:35:25.587+08	4	2025-08-25 02:21:53.355335+08	\N
6	Ryan's Pharmacy	321 Secure Lane, Safety Town, FL 33101	Rowell Tenorio Cruz	cruzrowellt11@gmail.com	5554567890	2025-10-08 19:18:57.211426+08	4	2025-10-08 21:30:39.611+08	4	2025-10-08 19:18:57.211426+08	\N
4	Campus Maintenance Co.	90 Facility Rd, Cityville	Daniel Cruz	daniel.cruz@campusmaint.com	0917-456-7890	2025-08-25 00:32:11.506681+08	1	2025-10-08 21:35:39.707+08	4	2025-08-25 02:21:53.355335+08	\N
2	Office Essentials Inc.	45 Office Lane, Cityville	asd	brian.santos@officeessentials.com	0917-234-5678	2025-08-25 00:32:11.506681+08	1	2025-10-08 21:42:29.105+08	4	2025-08-25 02:21:53.355335+08	\N
7	AAAAAA	321 Secure Lane, Safety Town, FL 33101	Rowell Tenorio Cruz	cruzrowellt11@gmail.com	5554567890	2025-10-08 19:33:17.205026+08	4	2025-10-08 21:36:10.931+08	4	2025-10-08 19:33:17.205026+08	\N
9	aaaaaaaaaa	321 Secure Lane, Safety Town, FL 33101	Rowell Tenorio Cruz	cruzrowellt11@gmail.com	5554567890	2025-10-08 21:42:47.739093+08	4	2025-10-08 23:31:47.482+08	4	2025-10-08 23:31:47.482+08	4
\.


--
-- Name: asset_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.asset_categories_id_seq', 5, true);


--
-- Name: asset_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.asset_requests_id_seq', 48, true);


--
-- Name: asset_units_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.asset_units_id_seq', 456, true);


--
-- Name: assets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.assets_id_seq', 18, true);


--
-- Name: completion_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.completion_requests_id_seq', 1, false);


--
-- Name: department_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.department_requests_id_seq', 27, true);


--
-- Name: departments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.departments_id_seq', 13, true);


--
-- Name: issue_reports_issue_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.issue_reports_issue_id_seq', 61, true);


--
-- Name: locations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.locations_id_seq', 10, true);


--
-- Name: password_reset_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.password_reset_requests_id_seq', 1, true);


--
-- Name: procurement_finalizations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.procurement_finalizations_id_seq', 33, true);


--
-- Name: procurement_task_attachments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.procurement_task_attachments_id_seq', 119, true);


--
-- Name: procurement_tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.procurement_tasks_id_seq', 23, true);


--
-- Name: requests_request_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.requests_request_id_seq', 147, true);


--
-- Name: schedule_occurrences_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.schedule_occurrences_id_seq', 64, true);


--
-- Name: schedule_templates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.schedule_templates_id_seq', 71, true);


--
-- Name: sub_location_assets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sub_location_assets_id_seq', 5, true);


--
-- Name: sub_locations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sub_locations_id_seq', 32, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 19, true);


--
-- Name: vendors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vendors_id_seq', 9, true);


--
-- Name: asset_categories asset_categories_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_categories
    ADD CONSTRAINT asset_categories_name_key UNIQUE (name);


--
-- Name: asset_categories asset_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_categories
    ADD CONSTRAINT asset_categories_pkey PRIMARY KEY (id);


--
-- Name: asset_requests asset_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_requests
    ADD CONSTRAINT asset_requests_pkey PRIMARY KEY (id);


--
-- Name: asset_units asset_units_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_units
    ADD CONSTRAINT asset_units_pkey PRIMARY KEY (id);


--
-- Name: asset_units asset_units_serial_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_units
    ADD CONSTRAINT asset_units_serial_number_key UNIQUE (serial_number);


--
-- Name: asset_units asset_units_unit_tag_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_units
    ADD CONSTRAINT asset_units_unit_tag_key UNIQUE (unit_tag);


--
-- Name: assets assets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_pkey PRIMARY KEY (id);


--
-- Name: completion_requests completion_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.completion_requests
    ADD CONSTRAINT completion_requests_pkey PRIMARY KEY (id);


--
-- Name: purchase_requests department_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_requests
    ADD CONSTRAINT department_requests_pkey PRIMARY KEY (id);


--
-- Name: departments departments_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_name_key UNIQUE (name);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- Name: issue_reports issue_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.issue_reports
    ADD CONSTRAINT issue_reports_pkey PRIMARY KEY (id);


--
-- Name: locations locations_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_name_key UNIQUE (name);


--
-- Name: locations locations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_pkey PRIMARY KEY (id);


--
-- Name: password_reset_requests password_reset_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_requests
    ADD CONSTRAINT password_reset_requests_pkey PRIMARY KEY (id);


--
-- Name: procurement_finalizations procurement_finalizations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procurement_finalizations
    ADD CONSTRAINT procurement_finalizations_pkey PRIMARY KEY (id);


--
-- Name: procurement_finalizations procurement_finalizations_task_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procurement_finalizations
    ADD CONSTRAINT procurement_finalizations_task_id_key UNIQUE (task_id);


--
-- Name: attachments procurement_task_attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attachments
    ADD CONSTRAINT procurement_task_attachments_pkey PRIMARY KEY (id);


--
-- Name: procurement_tasks procurement_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procurement_tasks
    ADD CONSTRAINT procurement_tasks_pkey PRIMARY KEY (id);


--
-- Name: requests requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_pkey PRIMARY KEY (id);


--
-- Name: schedule_occurrences schedule_occurrences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedule_occurrences
    ADD CONSTRAINT schedule_occurrences_pkey PRIMARY KEY (id);


--
-- Name: schedule_technicians schedule_technicians_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedule_technicians
    ADD CONSTRAINT schedule_technicians_pkey PRIMARY KEY (schedule_occurrence_id, user_id);


--
-- Name: schedule_template_assets schedule_template_assets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedule_template_assets
    ADD CONSTRAINT schedule_template_assets_pkey PRIMARY KEY (schedule_occurrence_id, asset_unit_id);


--
-- Name: schedule_templates schedule_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedule_templates
    ADD CONSTRAINT schedule_templates_pkey PRIMARY KEY (id);


--
-- Name: sub_location_assets sub_location_assets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sub_location_assets
    ADD CONSTRAINT sub_location_assets_pkey PRIMARY KEY (id);


--
-- Name: sub_locations sub_locations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sub_locations
    ADD CONSTRAINT sub_locations_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: vendor_offers vendor_offers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor_offers
    ADD CONSTRAINT vendor_offers_pkey PRIMARY KEY (vendor_id, asset_category_id);


--
-- Name: vendors vendors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendors
    ADD CONSTRAINT vendors_pkey PRIMARY KEY (id);


--
-- Name: idx_procurement_task_attachments_task_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_procurement_task_attachments_task_id ON public.attachments USING btree (task_id);


--
-- Name: asset_requests asset_requests_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_requests
    ADD CONSTRAINT asset_requests_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.assets(id) ON DELETE RESTRICT;


--
-- Name: asset_requests asset_requests_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_requests
    ADD CONSTRAINT asset_requests_location_id_fkey FOREIGN KEY (sub_location_id) REFERENCES public.locations(id) ON DELETE RESTRICT;


--
-- Name: asset_requests asset_requests_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_requests
    ADD CONSTRAINT asset_requests_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.requests(id) ON DELETE CASCADE;


--
-- Name: assets assets_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.asset_categories(id) ON DELETE RESTRICT;


--
-- Name: assets assets_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE RESTRICT;


--
-- Name: requests fk_approved_by; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT fk_approved_by FOREIGN KEY (approved_by) REFERENCES public.users(id);


--
-- Name: procurement_tasks fk_asset; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procurement_tasks
    ADD CONSTRAINT fk_asset FOREIGN KEY (asset_id) REFERENCES public.assets(id) ON DELETE CASCADE;


--
-- Name: procurement_tasks fk_created_by; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procurement_tasks
    ADD CONSTRAINT fk_created_by FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: purchase_requests fk_department; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_requests
    ADD CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE CASCADE;


--
-- Name: requests fk_rejected_by; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT fk_rejected_by FOREIGN KEY (rejected_by) REFERENCES public.users(id);


--
-- Name: purchase_requests fk_request; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_requests
    ADD CONSTRAINT fk_request FOREIGN KEY (request_id) REFERENCES public.requests(id);


--
-- Name: purchase_requests fk_requested_by; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_requests
    ADD CONSTRAINT fk_requested_by FOREIGN KEY (requested_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: procurement_tasks fk_updated_by; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procurement_tasks
    ADD CONSTRAINT fk_updated_by FOREIGN KEY (updated_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: issue_reports issue_reports_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.issue_reports
    ADD CONSTRAINT issue_reports_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.requests(id) ON DELETE CASCADE;


--
-- Name: procurement_finalizations procurement_finalizations_final_vendor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procurement_finalizations
    ADD CONSTRAINT procurement_finalizations_final_vendor_id_fkey FOREIGN KEY (final_vendor_id) REFERENCES public.vendors(id) ON DELETE SET NULL;


--
-- Name: procurement_finalizations procurement_finalizations_finalized_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procurement_finalizations
    ADD CONSTRAINT procurement_finalizations_finalized_by_fkey FOREIGN KEY (finalized_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: procurement_finalizations procurement_finalizations_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procurement_finalizations
    ADD CONSTRAINT procurement_finalizations_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.procurement_tasks(id) ON DELETE CASCADE;


--
-- Name: attachments procurement_task_attachments_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attachments
    ADD CONSTRAINT procurement_task_attachments_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.procurement_tasks(id) ON DELETE CASCADE;


--
-- Name: attachments procurement_task_attachments_uploaded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attachments
    ADD CONSTRAINT procurement_task_attachments_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: sub_location_assets sub_location_assets_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sub_location_assets
    ADD CONSTRAINT sub_location_assets_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.assets(id) ON DELETE CASCADE;


--
-- Name: sub_location_assets sub_location_assets_sub_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sub_location_assets
    ADD CONSTRAINT sub_location_assets_sub_location_id_fkey FOREIGN KEY (sub_location_id) REFERENCES public.sub_locations(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict hAVI5WeOMcgpiinXtysgGwqmE1PapKeFRYbLDnMH0IYWZ4Ozg9Kg5Fzxu1fJvA5

