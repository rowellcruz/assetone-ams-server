--
-- PostgreSQL database dump
--

\restrict PcUNRVFh3gntMBNB0UB61OKMCNZIpgDETeeNHfSW5crxci5c6Txb6Ll1QSHWk7W

-- Dumped from database version 17.6 (Debian 17.6-2.pgdg12+1)
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
-- Name: public; Type: SCHEMA; Schema: -; Owner: assetone_ams_db_5esl_user
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO assetone_ams_db_5esl_user;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: assetone_ams_db_5esl_user
--

COMMENT ON SCHEMA public IS '';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: procurement_status; Type: TYPE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE TYPE public.procurement_status AS ENUM (
    'for_approval',
    'cancelled',
    'processing',
    'completed'
);


ALTER TYPE public.procurement_status OWNER TO assetone_ams_db_5esl_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: activity_log; Type: TABLE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE TABLE public.activity_log (
    id bigint NOT NULL,
    user_id bigint,
    module character varying(50) NOT NULL,
    action character varying(50) NOT NULL,
    endpoint text NOT NULL,
    method character varying(10) NOT NULL,
    request_body jsonb,
    ip_address character varying(45),
    user_agent text,
    created_at timestamp with time zone DEFAULT now(),
    status_code integer
);


ALTER TABLE public.activity_log OWNER TO assetone_ams_db_5esl_user;

--
-- Name: activity_log_id_seq; Type: SEQUENCE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE SEQUENCE public.activity_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.activity_log_id_seq OWNER TO assetone_ams_db_5esl_user;

--
-- Name: activity_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER SEQUENCE public.activity_log_id_seq OWNED BY public.activity_log.id;


--
-- Name: borrow_logs; Type: TABLE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE TABLE public.borrow_logs (
    id bigint NOT NULL,
    item_unit_id bigint NOT NULL,
    borrowed_by character varying NOT NULL,
    lend_by bigint NOT NULL,
    borrowed_at timestamp with time zone DEFAULT now() NOT NULL,
    returned_at timestamp with time zone,
    status character varying(10) DEFAULT 'borrowed'::character varying NOT NULL,
    remarks character varying(255),
    purpose character varying,
    due_date timestamp with time zone NOT NULL
);


ALTER TABLE public.borrow_logs OWNER TO assetone_ams_db_5esl_user;

--
-- Name: borrow_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE SEQUENCE public.borrow_logs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.borrow_logs_id_seq OWNER TO assetone_ams_db_5esl_user;

--
-- Name: borrow_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER SEQUENCE public.borrow_logs_id_seq OWNED BY public.borrow_logs.id;


--
-- Name: departments; Type: TABLE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE TABLE public.departments (
    id bigint NOT NULL,
    name character varying(255),
    created_by bigint,
    updated_by bigint,
    deleted_by bigint,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    deleted_at timestamp with time zone,
    code character varying(100) NOT NULL
);


ALTER TABLE public.departments OWNER TO assetone_ams_db_5esl_user;

--
-- Name: departments_id_seq; Type: SEQUENCE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE SEQUENCE public.departments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.departments_id_seq OWNER TO assetone_ams_db_5esl_user;

--
-- Name: departments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER SEQUENCE public.departments_id_seq OWNED BY public.departments.id;


--
-- Name: item_attachments; Type: TABLE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE TABLE public.item_attachments (
    id bigint NOT NULL,
    item_id bigint NOT NULL,
    file_name character varying(255),
    file_path text,
    mime_type character varying(100),
    context character varying(50),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.item_attachments OWNER TO assetone_ams_db_5esl_user;

--
-- Name: item_attachments_id_seq; Type: SEQUENCE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE SEQUENCE public.item_attachments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.item_attachments_id_seq OWNER TO assetone_ams_db_5esl_user;

--
-- Name: item_attachments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER SEQUENCE public.item_attachments_id_seq OWNED BY public.item_attachments.id;


--
-- Name: item_categories; Type: TABLE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE TABLE public.item_categories (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    code character varying(50),
    created_by bigint,
    updated_by bigint,
    deleted_by bigint,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    deleted_at timestamp with time zone
);


ALTER TABLE public.item_categories OWNER TO assetone_ams_db_5esl_user;

--
-- Name: item_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE SEQUENCE public.item_categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.item_categories_id_seq OWNER TO assetone_ams_db_5esl_user;

--
-- Name: item_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER SEQUENCE public.item_categories_id_seq OWNED BY public.item_categories.id;


--
-- Name: item_costs; Type: TABLE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE TABLE public.item_costs (
    id bigint NOT NULL,
    item_unit_id bigint NOT NULL,
    purchase_price numeric(12,2),
    additional_cost numeric(12,2),
    total_cost numeric(12,2),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.item_costs OWNER TO assetone_ams_db_5esl_user;

--
-- Name: item_costs_id_seq; Type: SEQUENCE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE SEQUENCE public.item_costs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.item_costs_id_seq OWNER TO assetone_ams_db_5esl_user;

--
-- Name: item_costs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER SEQUENCE public.item_costs_id_seq OWNED BY public.item_costs.id;


--
-- Name: item_depreciation; Type: TABLE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE TABLE public.item_depreciation (
    id bigint NOT NULL,
    item_unit_id bigint NOT NULL,
    method character varying(50),
    purchase_date date,
    rate numeric(5,2),
    useful_life integer,
    accumulated_depreciation numeric(12,2) DEFAULT 0,
    updated_by bigint,
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.item_depreciation OWNER TO assetone_ams_db_5esl_user;

--
-- Name: item_depreciation_id_seq; Type: SEQUENCE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE SEQUENCE public.item_depreciation_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.item_depreciation_id_seq OWNER TO assetone_ams_db_5esl_user;

--
-- Name: item_depreciation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER SEQUENCE public.item_depreciation_id_seq OWNED BY public.item_depreciation.id;


--
-- Name: item_lifecycle; Type: TABLE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE TABLE public.item_lifecycle (
    id bigint NOT NULL,
    item_unit_id bigint NOT NULL,
    total_cost numeric(12,2) DEFAULT 0,
    maintenance_cost numeric(12,2) DEFAULT 0,
    repair_cost numeric(12,2) DEFAULT 0,
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.item_lifecycle OWNER TO assetone_ams_db_5esl_user;

--
-- Name: item_lifecycle_id_seq; Type: SEQUENCE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE SEQUENCE public.item_lifecycle_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.item_lifecycle_id_seq OWNER TO assetone_ams_db_5esl_user;

--
-- Name: item_lifecycle_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER SEQUENCE public.item_lifecycle_id_seq OWNED BY public.item_lifecycle.id;


--
-- Name: item_requests; Type: TABLE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE TABLE public.item_requests (
    id bigint NOT NULL,
    item_id bigint NOT NULL,
    quantity integer DEFAULT 1,
    reason text,
    remarks text,
    status character varying(50) DEFAULT 'pending'::character varying,
    date_required timestamp with time zone,
    requested_by bigint,
    requested_at timestamp with time zone DEFAULT now(),
    reviewed_by bigint,
    reviewed_at timestamp with time zone
);


ALTER TABLE public.item_requests OWNER TO assetone_ams_db_5esl_user;

--
-- Name: item_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE SEQUENCE public.item_requests_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.item_requests_id_seq OWNER TO assetone_ams_db_5esl_user;

--
-- Name: item_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER SEQUENCE public.item_requests_id_seq OWNED BY public.item_requests.id;


--
-- Name: item_units; Type: TABLE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE TABLE public.item_units (
    id bigint NOT NULL,
    item_id bigint NOT NULL,
    serial_number character varying(255),
    unit_tag character varying(50),
    specifications text,
    sub_location_id integer,
    is_legacy boolean DEFAULT false,
    owner_department_id bigint,
    created_by bigint,
    updated_by bigint,
    deleted_by bigint,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    deleted_at timestamp with time zone,
    vendor_id bigint,
    brand character varying(255) NOT NULL,
    condition integer DEFAULT 100,
    purchase_date timestamp with time zone,
    purchase_cost numeric(12,2),
    status character varying DEFAULT 'available'::character varying
);


ALTER TABLE public.item_units OWNER TO assetone_ams_db_5esl_user;

--
-- Name: item_units_id_seq; Type: SEQUENCE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE SEQUENCE public.item_units_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.item_units_id_seq OWNER TO assetone_ams_db_5esl_user;

--
-- Name: item_units_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER SEQUENCE public.item_units_id_seq OWNED BY public.item_units.id;


--
-- Name: items; Type: TABLE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE TABLE public.items (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    department_id bigint,
    created_by bigint,
    updated_by bigint,
    deleted_by bigint,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    deleted_at timestamp with time zone,
    useful_life integer,
    rul_percentage integer DEFAULT 33,
    performance_percentage integer DEFAULT 33,
    physical_percentage integer DEFAULT 34,
    rul_multiplier numeric(3,1) DEFAULT 1.0,
    performance_multiplier numeric(3,1) DEFAULT 1.0,
    physical_multiplier numeric(3,1) DEFAULT 1.0,
    category character varying(255)
);


ALTER TABLE public.items OWNER TO assetone_ams_db_5esl_user;

--
-- Name: items_for_distribution; Type: TABLE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE TABLE public.items_for_distribution (
    id bigint NOT NULL,
    purchase_request_id bigint,
    item_unit_id bigint,
    received_at timestamp with time zone
);


ALTER TABLE public.items_for_distribution OWNER TO assetone_ams_db_5esl_user;

--
-- Name: items_for_distribution_id_seq; Type: SEQUENCE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE SEQUENCE public.items_for_distribution_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.items_for_distribution_id_seq OWNER TO assetone_ams_db_5esl_user;

--
-- Name: items_for_distribution_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER SEQUENCE public.items_for_distribution_id_seq OWNED BY public.items_for_distribution.id;


--
-- Name: items_id_seq; Type: SEQUENCE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE SEQUENCE public.items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.items_id_seq OWNER TO assetone_ams_db_5esl_user;

--
-- Name: items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER SEQUENCE public.items_id_seq OWNED BY public.items.id;


--
-- Name: locations; Type: TABLE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE TABLE public.locations (
    id bigint NOT NULL,
    name character varying(255),
    created_by bigint,
    updated_by bigint,
    deleted_by bigint,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    deleted_at timestamp with time zone
);


ALTER TABLE public.locations OWNER TO assetone_ams_db_5esl_user;

--
-- Name: locations_id_seq; Type: SEQUENCE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE SEQUENCE public.locations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.locations_id_seq OWNER TO assetone_ams_db_5esl_user;

--
-- Name: locations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER SEQUENCE public.locations_id_seq OWNED BY public.locations.id;


--
-- Name: maintenance_history; Type: TABLE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE TABLE public.maintenance_history (
    id bigint NOT NULL,
    item_unit_id bigint NOT NULL,
    occurrence_id bigint,
    performed_by bigint,
    maintenance_type character varying(50),
    description text,
    performed_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.maintenance_history OWNER TO assetone_ams_db_5esl_user;

--
-- Name: maintenance_history_id_seq; Type: SEQUENCE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE SEQUENCE public.maintenance_history_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.maintenance_history_id_seq OWNER TO assetone_ams_db_5esl_user;

--
-- Name: maintenance_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER SEQUENCE public.maintenance_history_id_seq OWNED BY public.maintenance_history.id;


--
-- Name: maintenance_requests; Type: TABLE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE TABLE public.maintenance_requests (
    id bigint NOT NULL,
    item_unit_id bigint NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying,
    description text NOT NULL,
    requested_by character varying(255) NOT NULL,
    requested_at timestamp with time zone DEFAULT now(),
    reviewed_by bigint,
    reviewed_at timestamp with time zone,
    requestor_name character varying
);


ALTER TABLE public.maintenance_requests OWNER TO assetone_ams_db_5esl_user;

--
-- Name: maintenance_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE SEQUENCE public.maintenance_requests_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.maintenance_requests_id_seq OWNER TO assetone_ams_db_5esl_user;

--
-- Name: maintenance_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER SEQUENCE public.maintenance_requests_id_seq OWNED BY public.maintenance_requests.id;


--
-- Name: notification_receivers; Type: TABLE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE TABLE public.notification_receivers (
    id bigint NOT NULL,
    notification_id bigint NOT NULL,
    user_id bigint NOT NULL,
    seen_at timestamp with time zone
);


ALTER TABLE public.notification_receivers OWNER TO assetone_ams_db_5esl_user;

--
-- Name: notification_receivers_id_seq; Type: SEQUENCE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE SEQUENCE public.notification_receivers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notification_receivers_id_seq OWNER TO assetone_ams_db_5esl_user;

--
-- Name: notification_receivers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER SEQUENCE public.notification_receivers_id_seq OWNED BY public.notification_receivers.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE TABLE public.notifications (
    id bigint NOT NULL,
    module character varying(255),
    message text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.notifications OWNER TO assetone_ams_db_5esl_user;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE SEQUENCE public.notifications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_id_seq OWNER TO assetone_ams_db_5esl_user;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE TABLE public.password_reset_tokens (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    token_hash character varying(128) NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    used boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.password_reset_tokens OWNER TO assetone_ams_db_5esl_user;

--
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE SEQUENCE public.password_reset_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.password_reset_tokens_id_seq OWNER TO assetone_ams_db_5esl_user;

--
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER SEQUENCE public.password_reset_tokens_id_seq OWNED BY public.password_reset_tokens.id;


--
-- Name: pending_registration; Type: TABLE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE TABLE public.pending_registration (
    id integer NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    department_id integer,
    approved_by integer,
    CONSTRAINT pending_registration_status_check CHECK (((status)::text = ANY (ARRAY[('pending'::character varying)::text, ('approved'::character varying)::text, ('rejected'::character varying)::text])))
);


ALTER TABLE public.pending_registration OWNER TO assetone_ams_db_5esl_user;

--
-- Name: pending_registration_id_seq; Type: SEQUENCE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE SEQUENCE public.pending_registration_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pending_registration_id_seq OWNER TO assetone_ams_db_5esl_user;

--
-- Name: pending_registration_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER SEQUENCE public.pending_registration_id_seq OWNED BY public.pending_registration.id;


--
-- Name: pr_sequences; Type: TABLE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE TABLE public.pr_sequences (
    date_key character(8) NOT NULL,
    seq integer NOT NULL
);


ALTER TABLE public.pr_sequences OWNER TO assetone_ams_db_5esl_user;

--
-- Name: procurement_attachments; Type: TABLE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE TABLE public.procurement_attachments (
    id bigint NOT NULL,
    purchase_request_id bigint,
    file_name character varying(255),
    file_path text,
    uploaded_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    mime_type character varying(100),
    uploaded_by integer,
    module character varying
);


ALTER TABLE public.procurement_attachments OWNER TO assetone_ams_db_5esl_user;

--
-- Name: procurement_attachments_id_seq; Type: SEQUENCE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE SEQUENCE public.procurement_attachments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.procurement_attachments_id_seq OWNER TO assetone_ams_db_5esl_user;

--
-- Name: procurement_attachments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER SEQUENCE public.procurement_attachments_id_seq OWNED BY public.procurement_attachments.id;


--
-- Name: procurement_finalizations; Type: TABLE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE TABLE public.procurement_finalizations (
    id bigint NOT NULL,
    purchase_order_id bigint NOT NULL,
    finalized_at timestamp with time zone DEFAULT now(),
    remarks text
);


ALTER TABLE public.procurement_finalizations OWNER TO assetone_ams_db_5esl_user;

--
-- Name: procurement_finalizations_id_seq; Type: SEQUENCE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE SEQUENCE public.procurement_finalizations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.procurement_finalizations_id_seq OWNER TO assetone_ams_db_5esl_user;

--
-- Name: procurement_finalizations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER SEQUENCE public.procurement_finalizations_id_seq OWNED BY public.procurement_finalizations.id;


--
-- Name: purchase_order_items; Type: TABLE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE TABLE public.purchase_order_items (
    id integer NOT NULL,
    purchase_order_id integer NOT NULL,
    item_name character varying(255) NOT NULL,
    quantity integer NOT NULL,
    unit_price numeric(12,2) NOT NULL,
    total_amount numeric(12,2) GENERATED ALWAYS AS (((quantity)::numeric * unit_price)) STORED,
    specifications text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    brand character varying,
    acquired_date timestamp with time zone,
    useful_life integer,
    CONSTRAINT purchase_order_items_quantity_check CHECK ((quantity > 0)),
    CONSTRAINT purchase_order_items_unit_price_check CHECK ((unit_price >= (0)::numeric))
);


ALTER TABLE public.purchase_order_items OWNER TO assetone_ams_db_5esl_user;

--
-- Name: purchase_order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE SEQUENCE public.purchase_order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.purchase_order_items_id_seq OWNER TO assetone_ams_db_5esl_user;

--
-- Name: purchase_order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER SEQUENCE public.purchase_order_items_id_seq OWNED BY public.purchase_order_items.id;


--
-- Name: purchase_orders; Type: TABLE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE TABLE public.purchase_orders (
    id bigint NOT NULL,
    po_number character varying(50),
    vendor_id integer,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    purchase_request_id integer,
    status character varying DEFAULT 'pending'::character varying,
    delivered_at timestamp with time zone
);


ALTER TABLE public.purchase_orders OWNER TO assetone_ams_db_5esl_user;

--
-- Name: purchase_orders_id_seq; Type: SEQUENCE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE SEQUENCE public.purchase_orders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.purchase_orders_id_seq OWNER TO assetone_ams_db_5esl_user;

--
-- Name: purchase_orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER SEQUENCE public.purchase_orders_id_seq OWNED BY public.purchase_orders.id;


--
-- Name: purchase_requests; Type: TABLE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE TABLE public.purchase_requests (
    id integer NOT NULL,
    control_number character varying(50),
    date_required timestamp with time zone,
    requested_by bigint NOT NULL,
    requested_at timestamp with time zone DEFAULT now(),
    status character varying(50) DEFAULT 'pending'::character varying,
    item_category_id integer NOT NULL,
    reason text NOT NULL,
    remarks text,
    reviewed_by integer,
    reviewed_at timestamp with time zone,
    updated_at timestamp with time zone,
    updated_by integer,
    planned_cost numeric(12,2) DEFAULT 0 NOT NULL
);


ALTER TABLE public.purchase_requests OWNER TO assetone_ams_db_5esl_user;

--
-- Name: purchase_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE SEQUENCE public.purchase_requests_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.purchase_requests_id_seq OWNER TO assetone_ams_db_5esl_user;

--
-- Name: purchase_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER SEQUENCE public.purchase_requests_id_seq OWNED BY public.purchase_requests.id;


--
-- Name: relocation_log; Type: TABLE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE TABLE public.relocation_log (
    id integer NOT NULL,
    item_unit_id integer NOT NULL,
    from_sub_location_id integer,
    to_sub_location_id integer,
    created_by integer NOT NULL,
    completed_by integer,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.relocation_log OWNER TO assetone_ams_db_5esl_user;

--
-- Name: relocation_log_id_seq; Type: SEQUENCE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE SEQUENCE public.relocation_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.relocation_log_id_seq OWNER TO assetone_ams_db_5esl_user;

--
-- Name: relocation_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER SEQUENCE public.relocation_log_id_seq OWNED BY public.relocation_log.id;


--
-- Name: relocation_technicians; Type: TABLE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE TABLE public.relocation_technicians (
    id integer NOT NULL,
    relocation_log_id integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.relocation_technicians OWNER TO assetone_ams_db_5esl_user;

--
-- Name: relocation_technicians_id_seq; Type: SEQUENCE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE SEQUENCE public.relocation_technicians_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.relocation_technicians_id_seq OWNER TO assetone_ams_db_5esl_user;

--
-- Name: relocation_technicians_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER SEQUENCE public.relocation_technicians_id_seq OWNED BY public.relocation_technicians.id;


--
-- Name: requested_items; Type: TABLE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE TABLE public.requested_items (
    id bigint NOT NULL,
    purchase_request_id bigint NOT NULL,
    item_description text NOT NULL,
    quantity integer DEFAULT 1
);


ALTER TABLE public.requested_items OWNER TO assetone_ams_db_5esl_user;

--
-- Name: requested_items_id_seq; Type: SEQUENCE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE SEQUENCE public.requested_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.requested_items_id_seq OWNER TO assetone_ams_db_5esl_user;

--
-- Name: requested_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER SEQUENCE public.requested_items_id_seq OWNED BY public.requested_items.id;


--
-- Name: schedule_occurrences; Type: TABLE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE TABLE public.schedule_occurrences (
    id bigint NOT NULL,
    template_id bigint NOT NULL,
    scheduled_date timestamp with time zone,
    status character varying(50) DEFAULT 'pending'::character varying,
    review_remarks text,
    skipped_reason text,
    created_by bigint,
    updated_by bigint,
    started_by bigint,
    completed_by bigint,
    skipped_by bigint,
    reviewed_by bigint,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    started_at timestamp with time zone,
    completed_at timestamp with time zone,
    skipped_at timestamp with time zone,
    reviewed_at timestamp with time zone
);


ALTER TABLE public.schedule_occurrences OWNER TO assetone_ams_db_5esl_user;

--
-- Name: schedule_occurrences_id_seq; Type: SEQUENCE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE SEQUENCE public.schedule_occurrences_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.schedule_occurrences_id_seq OWNER TO assetone_ams_db_5esl_user;

--
-- Name: schedule_occurrences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER SEQUENCE public.schedule_occurrences_id_seq OWNED BY public.schedule_occurrences.id;


--
-- Name: schedule_technicians; Type: TABLE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE TABLE public.schedule_technicians (
    id bigint NOT NULL,
    occurrence_id bigint NOT NULL,
    user_id bigint NOT NULL,
    assigned_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.schedule_technicians OWNER TO assetone_ams_db_5esl_user;

--
-- Name: schedule_technicians_id_seq; Type: SEQUENCE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE SEQUENCE public.schedule_technicians_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.schedule_technicians_id_seq OWNER TO assetone_ams_db_5esl_user;

--
-- Name: schedule_technicians_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER SEQUENCE public.schedule_technicians_id_seq OWNED BY public.schedule_technicians.id;


--
-- Name: schedule_templates; Type: TABLE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE TABLE public.schedule_templates (
    id bigint NOT NULL,
    type character varying(50),
    title character varying(255),
    description text,
    frequency_value integer,
    frequency_unit character varying(50),
    grace_period_value integer,
    grace_period_unit character varying(50),
    status character varying(50) DEFAULT 'active'::character varying,
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    created_by bigint,
    updated_by bigint,
    stopped_by bigint,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    stopped_at timestamp with time zone,
    item_id integer NOT NULL,
    item_unit_id integer
);


ALTER TABLE public.schedule_templates OWNER TO assetone_ams_db_5esl_user;

--
-- Name: schedule_templates_id_seq; Type: SEQUENCE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE SEQUENCE public.schedule_templates_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.schedule_templates_id_seq OWNER TO assetone_ams_db_5esl_user;

--
-- Name: schedule_templates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER SEQUENCE public.schedule_templates_id_seq OWNED BY public.schedule_templates.id;


--
-- Name: schedule_units; Type: TABLE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE TABLE public.schedule_units (
    id bigint NOT NULL,
    occurrence_id bigint NOT NULL,
    item_unit_id bigint NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying,
    review text,
    condition integer DEFAULT 100,
    completed_at timestamp with time zone,
    completed_by integer
);


ALTER TABLE public.schedule_units OWNER TO assetone_ams_db_5esl_user;

--
-- Name: schedule_units_id_seq; Type: SEQUENCE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE SEQUENCE public.schedule_units_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.schedule_units_id_seq OWNER TO assetone_ams_db_5esl_user;

--
-- Name: schedule_units_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER SEQUENCE public.schedule_units_id_seq OWNED BY public.schedule_units.id;


--
-- Name: sub_locations; Type: TABLE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE TABLE public.sub_locations (
    id bigint NOT NULL,
    location_id bigint NOT NULL,
    name character varying(255),
    created_by bigint,
    updated_by bigint,
    deleted_by bigint,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    deleted_at timestamp with time zone
);


ALTER TABLE public.sub_locations OWNER TO assetone_ams_db_5esl_user;

--
-- Name: sub_locations_id_seq; Type: SEQUENCE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE SEQUENCE public.sub_locations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sub_locations_id_seq OWNER TO assetone_ams_db_5esl_user;

--
-- Name: sub_locations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER SEQUENCE public.sub_locations_id_seq OWNED BY public.sub_locations.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    first_name character varying(255),
    last_name character varying(255),
    email character varying(255),
    password text,
    role character varying(50),
    department_id bigint,
    status character varying(50) DEFAULT 'inactive'::character varying,
    created_by bigint,
    updated_by bigint,
    disabled_by bigint,
    deleted_by bigint,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    disabled_at timestamp with time zone,
    deleted_at timestamp with time zone,
    is_password_updated boolean DEFAULT false NOT NULL
);


ALTER TABLE public.users OWNER TO assetone_ams_db_5esl_user;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE public.users ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: vendor_offers; Type: TABLE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE TABLE public.vendor_offers (
    id bigint NOT NULL,
    vendor_id bigint NOT NULL,
    item_category_id bigint,
    item_id bigint,
    offer_details text,
    price numeric(12,2),
    valid_until date,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.vendor_offers OWNER TO assetone_ams_db_5esl_user;

--
-- Name: vendor_offers_id_seq; Type: SEQUENCE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE SEQUENCE public.vendor_offers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vendor_offers_id_seq OWNER TO assetone_ams_db_5esl_user;

--
-- Name: vendor_offers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER SEQUENCE public.vendor_offers_id_seq OWNED BY public.vendor_offers.id;


--
-- Name: vendors; Type: TABLE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE TABLE public.vendors (
    id bigint NOT NULL,
    name character varying(255),
    contact_person character varying(255),
    contact_email character varying(255),
    contact_phone character varying(50),
    address text,
    created_by bigint,
    updated_by bigint,
    deleted_by bigint,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    deleted_at timestamp with time zone
);


ALTER TABLE public.vendors OWNER TO assetone_ams_db_5esl_user;

--
-- Name: vendors_id_seq; Type: SEQUENCE; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE SEQUENCE public.vendors_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vendors_id_seq OWNER TO assetone_ams_db_5esl_user;

--
-- Name: vendors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER SEQUENCE public.vendors_id_seq OWNED BY public.vendors.id;


--
-- Name: activity_log id; Type: DEFAULT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.activity_log ALTER COLUMN id SET DEFAULT nextval('public.activity_log_id_seq'::regclass);


--
-- Name: borrow_logs id; Type: DEFAULT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.borrow_logs ALTER COLUMN id SET DEFAULT nextval('public.borrow_logs_id_seq'::regclass);


--
-- Name: departments id; Type: DEFAULT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.departments ALTER COLUMN id SET DEFAULT nextval('public.departments_id_seq'::regclass);


--
-- Name: item_attachments id; Type: DEFAULT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.item_attachments ALTER COLUMN id SET DEFAULT nextval('public.item_attachments_id_seq'::regclass);


--
-- Name: item_categories id; Type: DEFAULT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.item_categories ALTER COLUMN id SET DEFAULT nextval('public.item_categories_id_seq'::regclass);


--
-- Name: item_costs id; Type: DEFAULT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.item_costs ALTER COLUMN id SET DEFAULT nextval('public.item_costs_id_seq'::regclass);


--
-- Name: item_depreciation id; Type: DEFAULT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.item_depreciation ALTER COLUMN id SET DEFAULT nextval('public.item_depreciation_id_seq'::regclass);


--
-- Name: item_lifecycle id; Type: DEFAULT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.item_lifecycle ALTER COLUMN id SET DEFAULT nextval('public.item_lifecycle_id_seq'::regclass);


--
-- Name: item_requests id; Type: DEFAULT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.item_requests ALTER COLUMN id SET DEFAULT nextval('public.item_requests_id_seq'::regclass);


--
-- Name: item_units id; Type: DEFAULT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.item_units ALTER COLUMN id SET DEFAULT nextval('public.item_units_id_seq'::regclass);


--
-- Name: items id; Type: DEFAULT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.items ALTER COLUMN id SET DEFAULT nextval('public.items_id_seq'::regclass);


--
-- Name: items_for_distribution id; Type: DEFAULT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.items_for_distribution ALTER COLUMN id SET DEFAULT nextval('public.items_for_distribution_id_seq'::regclass);


--
-- Name: locations id; Type: DEFAULT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.locations ALTER COLUMN id SET DEFAULT nextval('public.locations_id_seq'::regclass);


--
-- Name: maintenance_history id; Type: DEFAULT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.maintenance_history ALTER COLUMN id SET DEFAULT nextval('public.maintenance_history_id_seq'::regclass);


--
-- Name: maintenance_requests id; Type: DEFAULT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.maintenance_requests ALTER COLUMN id SET DEFAULT nextval('public.maintenance_requests_id_seq'::regclass);


--
-- Name: notification_receivers id; Type: DEFAULT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.notification_receivers ALTER COLUMN id SET DEFAULT nextval('public.notification_receivers_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: password_reset_tokens id; Type: DEFAULT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.password_reset_tokens ALTER COLUMN id SET DEFAULT nextval('public.password_reset_tokens_id_seq'::regclass);


--
-- Name: pending_registration id; Type: DEFAULT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.pending_registration ALTER COLUMN id SET DEFAULT nextval('public.pending_registration_id_seq'::regclass);


--
-- Name: procurement_attachments id; Type: DEFAULT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.procurement_attachments ALTER COLUMN id SET DEFAULT nextval('public.procurement_attachments_id_seq'::regclass);


--
-- Name: procurement_finalizations id; Type: DEFAULT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.procurement_finalizations ALTER COLUMN id SET DEFAULT nextval('public.procurement_finalizations_id_seq'::regclass);


--
-- Name: purchase_order_items id; Type: DEFAULT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.purchase_order_items ALTER COLUMN id SET DEFAULT nextval('public.purchase_order_items_id_seq'::regclass);


--
-- Name: purchase_orders id; Type: DEFAULT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.purchase_orders ALTER COLUMN id SET DEFAULT nextval('public.purchase_orders_id_seq'::regclass);


--
-- Name: purchase_requests id; Type: DEFAULT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.purchase_requests ALTER COLUMN id SET DEFAULT nextval('public.purchase_requests_id_seq'::regclass);


--
-- Name: relocation_log id; Type: DEFAULT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.relocation_log ALTER COLUMN id SET DEFAULT nextval('public.relocation_log_id_seq'::regclass);


--
-- Name: relocation_technicians id; Type: DEFAULT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.relocation_technicians ALTER COLUMN id SET DEFAULT nextval('public.relocation_technicians_id_seq'::regclass);


--
-- Name: requested_items id; Type: DEFAULT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.requested_items ALTER COLUMN id SET DEFAULT nextval('public.requested_items_id_seq'::regclass);


--
-- Name: schedule_occurrences id; Type: DEFAULT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.schedule_occurrences ALTER COLUMN id SET DEFAULT nextval('public.schedule_occurrences_id_seq'::regclass);


--
-- Name: schedule_technicians id; Type: DEFAULT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.schedule_technicians ALTER COLUMN id SET DEFAULT nextval('public.schedule_technicians_id_seq'::regclass);


--
-- Name: schedule_templates id; Type: DEFAULT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.schedule_templates ALTER COLUMN id SET DEFAULT nextval('public.schedule_templates_id_seq'::regclass);


--
-- Name: schedule_units id; Type: DEFAULT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.schedule_units ALTER COLUMN id SET DEFAULT nextval('public.schedule_units_id_seq'::regclass);


--
-- Name: sub_locations id; Type: DEFAULT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.sub_locations ALTER COLUMN id SET DEFAULT nextval('public.sub_locations_id_seq'::regclass);


--
-- Name: vendor_offers id; Type: DEFAULT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.vendor_offers ALTER COLUMN id SET DEFAULT nextval('public.vendor_offers_id_seq'::regclass);


--
-- Name: vendors id; Type: DEFAULT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.vendors ALTER COLUMN id SET DEFAULT nextval('public.vendors_id_seq'::regclass);


--
-- Data for Name: activity_log; Type: TABLE DATA; Schema: public; Owner: assetone_ams_db_5esl_user
--

COPY public.activity_log (id, user_id, module, action, endpoint, method, request_body, ip_address, user_agent, created_at, status_code) FROM stdin;
19	\N	auth	LOGIN	/api/auth/login	POST	{"email": "samms.dyci@gmail.com", "password": "password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-28 11:59:28.765952+00	\N
20	\N	auth	LOGIN	/api/auth/login	POST	{"email": "samms.dyci@gmail.com", "password": "password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-28 12:01:13.495523+00	\N
21	\N	auth	LOGIN	/api/auth/login	POST	{"email": "samms.dyci@gmail.com", "password": "password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-28 12:05:59.483612+00	200
22	\N	auth	LOGIN	/api/auth/login	POST	{"email": "zaravoc5@gmail.com", "password": "@Password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-28 12:07:11.736202+00	200
23	\N	auth	LOGIN	/api/auth/login	POST	{"email": "zaravoc5@gmail.com", "password": "@Password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-28 12:07:14.558885+00	200
24	\N	auth	LOGIN	/api/auth/login	POST	{"email": "zaravoc5@gmail.com", "password": "@Password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-28 12:08:11.213558+00	200
25	\N	auth	LOGIN	/api/auth/login	POST	{"email": "zaravoc5@gmail.com", "password": "@Password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-28 12:09:21.600393+00	200
26	\N	auth	LOGIN	/api/auth/login	POST	{"email": "zaravoc5@gmail.com", "password": "@Password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-28 12:09:30.661277+00	200
27	\N	auth	LOGIN	/api/auth/login	POST	{"email": "zaravoc5@gmail.com", "password": "@Password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-28 12:10:39.792404+00	200
28	\N	auth	LOGIN	/api/auth/login	POST	{"email": "zaravoc5@gmail.com", "password": "@Password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-28 12:13:16.472911+00	200
29	\N	auth	LOGIN	/api/auth/login	POST	{"email": "samms.dyci@gmail.com", "password": "password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-28 12:14:49.93574+00	200
30	85	auth	LOGIN	/api/auth/login	POST	{"email": "samms.dyci@gmail.com", "password": "password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-28 12:28:50.465363+00	200
31	\N	auth	LOGIN_FAILED	/api/auth/login	POST	{"email": "samms.dyci@gmail.comasdasd", "password": "password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-28 12:28:59.267921+00	200
32	85	auth	LOGIN	/api/auth/login	POST	{"email": "samms.dyci@gmail.com", "password": "password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-28 12:29:04.77225+00	200
33	\N	auth	LOGIN_FAILED	/api/auth/login	POST	{"email": "samms.dyci@gmail.comasd", "password": "password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-28 12:33:26.979332+00	500
34	85	auth	LOGIN	/api/auth/login	POST	{"email": "samms.dyci@gmail.com", "password": "password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-28 12:33:29.728801+00	200
35	85	users	UPDATE	/api/users/94	PATCH	{"status": "disabled", "updated_at": "2025-11-28T14:16:43.410Z", "updated_by": "85", "disabled_at": "2025-11-28T14:16:43.410Z", "disabled_by": "85"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-28 14:16:44.028151+00	200
36	85	users	UPDATE	/api/users/94	PATCH	{"status": "inactive", "updated_at": "2025-11-28T14:16:48.764Z", "updated_by": "85", "disabled_at": null, "disabled_by": null}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-28 14:16:49.36043+00	200
37	\N	auth	REQUEST_FAILED	/api/auth/request-password-reset	POST	{"email": "cruzrowellt11@gmail.com"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-28 14:57:56.73748+00	500
38	\N	auth	REQUEST	/api/auth/request-password-reset	POST	{"email": "cruzrowellt11@gmail.com"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-28 14:59:21.451438+00	200
39	\N	auth	REQUEST_FAILED	/api/auth/request-password-reset	POST	{"email": "rowellcruz145@gmail.com"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-28 15:04:51.370071+00	500
40	\N	auth	REQUEST_FAILED	/api/auth/request-password-reset	POST	{"email": "rowellcruz145@gmail.com"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-28 15:17:31.197405+00	500
41	\N	auth	REQUEST	/api/auth/request-password-reset	POST	{"email": "rowellcruz145@gmail.com"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-28 15:22:21.032232+00	200
42	\N	auth	REQUEST	/api/auth/request-password-reset	POST	{"email": "rowellcruz145@gmail.com"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-28 15:25:16.022323+00	200
43	\N	auth	REQUEST	/api/auth/request-password-reset	POST	{"email": "rowellcruz145@gmail.com"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-28 15:26:40.889884+00	200
44	\N	auth	REQUEST_FAILED	/api/auth/request-password-reset	POST	{"email": "rowellcruz145@gmail.com"}	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-28 15:27:00.013174+00	500
45	\N	auth	REQUEST	/api/auth/request-password-reset	POST	{"email": "samms.dyci@gmail.com"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-28 15:30:23.750041+00	200
46	\N	auth	REQUEST	/api/auth/request-password-reset	POST	{"email": "cruzrowellt11@gmail.com"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-28 15:32:23.854876+00	200
47	\N	auth	REQUEST	/api/auth/request-password-reset	POST	{"email": "rowellcruz145@gmail.com"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-28 15:36:52.122259+00	200
48	\N	auth	REQUEST	/api/auth/request-password-reset	POST	{"email": "cruzrowellt11@gmail.com"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-28 15:47:22.424224+00	200
49	85	auth	LOGIN	/api/auth/login	POST	{"email": "samms.dyci@gmail.com", "password": "password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-28 15:57:14.477274+00	200
50	\N	auth	REQUEST	/api/auth/request-password-reset	POST	{"email": "rowellcruz145@gmail.com"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-28 16:00:08.842572+00	200
51	86	auth	LOGIN	/api/auth/login	POST	{"email": "cruzrowellt11@gmail.com", "password": "password123"}	127.0.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36	2025-11-28 16:01:26.774489+00	200
52	86	items	DOWNLOAD_FAILED	/api/items/stickers	POST	{"unitIds": ["422"]}	127.0.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36	2025-11-28 16:01:51.294381+00	500
53	86	items	DOWNLOAD_FAILED	/api/items/stickers	POST	{"unitIds": ["422"]}	127.0.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36	2025-11-28 16:01:59.513083+00	500
54	86	items	DOWNLOAD_FAILED	/api/items/stickers	POST	{"unitIds": ["422"]}	127.0.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36	2025-11-28 16:02:08.391092+00	500
55	86	items	DOWNLOAD_FAILED	/api/items/stickers	POST	{"unitIds": ["422"]}	127.0.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36	2025-11-28 16:02:14.280349+00	500
56	86	itemUnits	CREATE	/api/item-units	POST	{"brand": "hehe", "item_id": "54", "is_legacy": true, "vendor_id": "28", "created_by": "86", "updated_by": "86", "purchase_cost": 5000, "purchase_date": "2025-11-29", "batch_quantity": 1, "serial_numbers": ["ABC123"]}	127.0.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36	2025-11-28 16:02:37.796807+00	201
57	86	itemUnits	UPDATE	/api/item-units/assign-location	POST	{"itemIds": ["423"], "subLocationId": "52"}	127.0.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36	2025-11-28 16:02:51.094107+00	201
58	86	auth	LOGIN	/api/auth/login	POST	{"email": "cruzrowellt11@gmail.com", "password": "password123"}	127.0.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-11-29 01:27:52.892707+00	200
59	86	items	DOWNLOAD_FAILED	/api/items/stickers	POST	{"unitIds": ["422", "423"]}	127.0.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-11-29 01:28:40.593643+00	500
60	86	auth	LOGIN	/api/auth/login	POST	{"email": "cruzrowellt11@gmail.com", "password": "password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-29 02:07:42.559594+00	200
61	86	items	DOWNLOAD_FAILED	/api/items/stickers	POST	{"unitIds": ["422", "423"]}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-29 02:07:47.895121+00	500
62	86	items	DOWNLOAD_FAILED	/api/items/stickers	POST	{"unitIds": ["422", "423"]}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-29 02:07:56.503253+00	500
63	86	items	DOWNLOAD_FAILED	/api/items/stickers	POST	{"unitIds": ["422", "423"]}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-29 02:08:52.625602+00	500
64	86	items	DOWNLOAD_FAILED	/api/items/stickers	POST	{"unitIds": ["422", "423"]}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-29 02:09:58.567849+00	500
65	86	items	DOWNLOAD	/api/items/stickers	POST	{"unitIds": ["422", "423"]}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-29 02:10:25.439109+00	200
66	86	auth	LOGIN	/api/auth/login	POST	{"email": "cruzrowellt11@gmail.com", "password": "password123"}	127.0.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36	2025-11-29 02:13:09.797355+00	200
67	86	items	DOWNLOAD	/api/items/stickers	POST	{"unitIds": ["422", "423"]}	127.0.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36	2025-11-29 02:13:19.194975+00	200
68	86	items	DOWNLOAD	/api/items/stickers	POST	{"unitIds": ["422", "423"]}	127.0.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36	2025-11-29 02:13:34.198678+00	200
69	86	items	DOWNLOAD	/api/items/stickers	POST	{"unitIds": ["422", "423"]}	127.0.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36	2025-11-29 02:13:38.595731+00	200
70	86	items	DOWNLOAD	/api/items/stickers	POST	{"unitIds": ["422", "423"]}	127.0.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36	2025-11-29 02:13:56.798694+00	200
71	\N	auth	REQUEST	/api/auth/request-password-reset	POST	{"email": "cruzrowellt11@gmail.com"}	127.0.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36	2025-11-29 04:10:11.30091+00	200
72	86	auth	LOGIN	/api/auth/login	POST	{"email": "cruzrowellt11@gmail.com", "password": "password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-30 13:04:06.570376+00	200
73	86	auth	LOGIN	/api/auth/login	POST	{"email": "cruzrowellt11@gmail.com", "password": "password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-30 23:30:12.352192+00	200
74	99	auth	LOGIN	/api/auth/login	POST	{"email": "zaravoc5@gmail.com", "password": "@Password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-30 23:37:34.029593+00	200
75	86	auth	LOGIN	/api/auth/login	POST	{"email": "cruzrowellt11@gmail.com", "password": "password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-30 23:38:01.258939+00	200
76	94	auth	LOGIN_FAILED	/api/auth/login	POST	{"email": "cruz.rowell00510@gmail.com", "password": "123123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-30 23:53:58.301947+00	500
77	94	auth	LOGIN	/api/auth/login	POST	{"email": "cruz.rowell00510@gmail.com", "password": "password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-30 23:54:03.057902+00	200
78	86	auth	LOGIN	/api/auth/login	POST	{"email": "cruzrowellt11@gmail.com", "password": "password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-30 23:54:52.109736+00	200
79	86	auth	LOGIN	/api/auth/login	POST	{"email": "cruzrowellt11@gmail.com", "password": "password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-30 23:54:57.494728+00	200
80	86	auth	LOGIN	/api/auth/login	POST	{"email": "cruzrowellt11@gmail.com", "password": "password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-30 23:58:04.649934+00	200
81	86	auth	LOGIN_FAILED	/api/auth/login	POST	{"email": "cruzrowellt11@gmail.com", "password": "password123asd"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-30 23:58:07.883974+00	500
82	86	auth	LOGIN_FAILED	/api/auth/login	POST	{"email": "cruzrowellt11@gmail.com", "password": "password123asd"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-30 23:58:32.156201+00	500
83	\N	auth	REGISTER_FAILED	/api/auth/register	POST	{"email": "cruzrowellt11@gmail.com", "last_name": "Cruz", "first_name": "Rowell"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-30 23:58:41.581496+00	500
84	\N	auth	REGISTER_FAILED	/api/auth/register	POST	{"email": "cruzrowellt11@gmail.com", "last_name": "Cruz", "first_name": "Rowell"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-30 23:58:57.93122+00	500
85	99	auth	LOGIN	/api/auth/login	POST	{"email": "zaravoc5@gmail.com", "password": "@Password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-30 23:59:23.846926+00	200
86	86	auth	LOGIN	/api/auth/login	POST	{"email": "cruzrowellt11@gmail.com", "password": "password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-01 01:02:59.1295+00	200
87	99	auth	LOGIN	/api/auth/login	POST	{"email": "zaravoc5@gmail.com", "password": "@Password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-01 01:03:57.275846+00	200
88	86	auth	LOGIN	/api/auth/login	POST	{"email": "cruzrowellt11@gmail.com", "password": "password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-01 01:04:05.020771+00	200
89	86	items	CREATE	/api/items/	POST	{"name": "asd", "category": "Furniture", "created_by": "86", "updated_by": "86", "department_id": "28"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-01 01:04:15.702192+00	201
90	85	auth	LOGIN	/api/auth/login	POST	{"email": "samms.dyci@gmail.com", "password": "password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-01 01:08:52.666669+00	200
91	\N	auth	REGISTER	/api/auth/register	POST	{"email": "asd@asd.asd", "last_name": "asda", "first_name": "asd"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-01 02:28:48.039182+00	200
92	85	auth	LOGIN	/api/auth/login	POST	{"email": "samms.dyci@gmail.com", "password": "password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-01 02:28:53.87657+00	200
93	\N	admin	APPROVE	/api/admin/approve-registration	POST	{"adminId": "85", "pendingId": 25, "assignedRole": "property_custodian", "departmentId": "21"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-01 02:29:08.770337+00	200
94	86	auth	LOGIN	/api/auth/login	POST	{"email": "cruzrowellt11@gmail.com", "password": "password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-01 02:29:22.675714+00	200
95	86	items	DOWNLOAD	/api/items/stickers	POST	{"unitIds": ["423"]}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-01 02:29:28.667067+00	200
96	86	auth	LOGIN	/api/auth/login	POST	{"email": "cruzrowellt11@gmail.com", "password": "password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-01 22:21:41.570978+00	200
97	86	items	CREATE_FAILED	/api/items/	POST	{"name": "ge", "category": "Appliances / Electronics", "created_by": "86", "updated_by": "86", "department_id": ""}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-01 22:29:34.16637+00	500
98	86	items	CREATE_FAILED	/api/items/	POST	{"name": "ge", "category": "Appliances / Electronics", "created_by": "86", "updated_by": "86", "department_id": ""}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-01 22:30:33.482172+00	500
99	86	items	CREATE	/api/items/	POST	{"name": "ge", "category": "Appliances / Electronics", "created_by": "86", "updated_by": "86", "department_id": null}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-01 22:32:28.249249+00	201
100	86	items	UPDATE	/api/items/56	PATCH	{"updated_at": "2025-12-01T22:36:43.043Z", "updated_by": "86", "useful_life": 5}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-01 22:36:43.387808+00	200
101	86	auth	LOGIN	/api/auth/login	POST	{"email": "cruzrowellt11@gmail.com", "password": "password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-01 22:38:14.305288+00	200
102	86	auth	LOGIN	/api/auth/login	POST	{"email": "cruzrowellt11@gmail.com", "password": "password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-01 22:38:18.534897+00	200
103	86	auth	LOGIN	/api/auth/login	POST	{"email": "cruzrowellt11@gmail.com", "password": "password123"}	127.0.0.1	Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36 Edg/142.0.0.0	2025-12-01 22:41:16.752694+00	200
104	99	auth	LOGIN	/api/auth/login	POST	{"email": "zaravoc5@gmail.com", "password": "@Password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-01 22:56:40.883264+00	200
105	94	auth	LOGIN_FAILED	/api/auth/login	POST	{"email": "cruz.rowell00510@gmail.com", "password": "123123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-01 22:56:49.618165+00	500
106	94	auth	LOGIN_FAILED	/api/auth/login	POST	{"email": "cruz.rowell00510@gmail.com", "password": "passowrd123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-01 22:56:53.818344+00	500
107	94	auth	LOGIN_FAILED	/api/auth/login	POST	{"email": "cruz.rowell00510@gmail.com", "password": "@Password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-01 22:57:00.957464+00	500
108	94	auth	LOGIN	/api/auth/login	POST	{"email": "cruz.rowell00510@gmail.com", "password": "password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-01 22:57:05.964753+00	200
109	86	auth	LOGIN	/api/auth/login	POST	{"email": "cruzrowellt11@gmail.com", "password": "password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-01 22:57:11.734202+00	200
110	93	auth	LOGIN_FAILED	/api/auth/login	POST	{"email": "rowellcruz145@gmail.com", "password": "password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-01 22:57:26.1193+00	500
111	93	auth	LOGIN_FAILED	/api/auth/login	POST	{"email": "rowellcruz145@gmail.com", "password": "@Password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-01 22:57:33.579096+00	500
112	93	auth	LOGIN_FAILED	/api/auth/login	POST	{"email": "rowellcruz145@gmail.com", "password": "password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-01 22:57:37.587293+00	500
113	93	auth	LOGIN	/api/auth/login	POST	{"email": "rowellcruz145@gmail.com", "password": "password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-01 22:59:41.228749+00	200
114	\N	auth	UPDATE	/api/auth/change-password/93	POST	{"newPassword": "@Password123", "isNewAccount": true}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-01 23:02:49.929153+00	200
115	86	auth	LOGIN	/api/auth/login	POST	{"email": "cruzrowellt11@gmail.com", "password": "password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-01 23:03:16.128873+00	200
116	86	itemUnits	CREATE	/api/item-units	POST	{"brand": "asd", "item_id": "56", "is_legacy": true, "vendor_id": "25", "created_by": "86", "updated_by": "86", "purchase_cost": 3214, "purchase_date": "2025-12-02", "batch_quantity": 1, "serial_numbers": ["asda"]}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-01 23:17:17.968542+00	201
117	86	itemUnits	UPDATE	/api/item-units/assign-location	POST	{"itemIds": ["424"], "subLocationId": "31"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-01 23:17:27.201887+00	201
118	86	scheduleTemplates	CREATE	/api/schedule-templates	POST	{"type": "CM", "item_id": "56", "created_by": "86", "start_date": "2025-12-02T07:18", "updated_at": "2025-12-01T23:18:44.126Z", "updated_by": "86", "description": "Repair required for ge", "item_unit_id": "424", "frequency_unit": "days", "frequency_value": 1}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-01 23:18:44.508227+00	201
119	86	maintenanceRequest	UPDATE	/api/maintenance-requests/update	POST	{"status": "approved", "item_unit_id": "424"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-01 23:18:45.663659+00	201
120	86	auth	LOGIN	/api/auth/login	POST	{"email": "cruzrowellt11@gmail.com", "password": "password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-01 23:33:18.912303+00	200
121	\N	admin	APPROVE	/api/admin/approve-registration	POST	{"adminId": "86", "pendingId": 25, "assignedRole": "technician", "departmentId": 0}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-01 23:50:18.482507+00	200
122	\N	admin	APPROVE	/api/admin/approve-registration	POST	{"adminId": "86", "pendingId": 23, "assignedRole": "technician", "departmentId": 0}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-01 23:52:18.277477+00	200
123	\N	admin	APPROVE	/api/admin/approve-registration	POST	{"adminId": "86", "pendingId": 25, "assignedRole": "technician", "departmentId": null}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-01 23:54:15.855323+00	200
124	86	items	CREATE_FAILED	/api/items/	POST	{"name": "asd", "category": "Appliances / Electronics", "created_by": "86", "updated_by": "86", "department_id": null}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-01 23:55:16.147984+00	500
125	86	items	CREATE	/api/items/	POST	{"name": "asdasd", "category": "Appliances / Electronics", "created_by": "86", "updated_by": "86", "department_id": null}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-01 23:55:19.884048+00	201
126	86	auth	LOGIN	/api/auth/login	POST	{"email": "cruzrowellt11@gmail.com", "password": "password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-02 00:05:18.582044+00	200
127	85	auth	LOGIN	/api/auth/login	POST	{"email": "samms.dyci@gmail.com", "password": "password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-02 00:05:34.685871+00	200
128	85	auth	LOGIN	/api/auth/login	POST	{"email": "samms.dyci@gmail.com", "password": "password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-02 00:08:50.963535+00	200
129	85	auth	LOGIN	/api/auth/login	POST	{"email": "samms.dyci@gmail.com", "password": "password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-02 00:10:46.877891+00	200
130	\N	admin	BACKUP_FAILED	/api/admin/backup-data	POST	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-02 00:47:11.638206+00	500
131	\N	admin	BACKUP_FAILED	/api/admin/backup-data	POST	{"confirmPassword": "password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-02 00:47:39.741302+00	500
132	85	auth	LOGIN	/api/auth/login	POST	{"email": "samms.dyci@gmail.com", "password": "password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-02 00:48:03.032968+00	200
133	\N	admin	BACKUP_FAILED	/api/admin/backup-data	POST	{"confirmPassword": "password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-02 00:48:07.79962+00	500
134	\N	admin	BACKUP_FAILED	/api/admin/backup-data	POST	{"confirmPassword": "password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-02 00:49:14.146101+00	500
135	85	admin	BACKUP_FAILED	/api/admin/backup-data	POST	{"confirmPassword": "password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-02 00:49:37.719001+00	500
136	85	admin	BACKUP_FAILED	/api/admin/backup-data	POST	{"confirmPassword": "password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-02 00:50:36.097252+00	500
137	85	admin	BACKUP_FAILED	/api/admin/backup-data	POST	{"confirmPassword": "password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-02 00:54:55.696989+00	500
138	85	admin	BACKUP	/api/admin/backup-data	POST	{"confirmPassword": "password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-02 01:00:43.955545+00	200
139	85	admin	BACKUP_FAILED	/api/admin/backup-data	POST	{"confirmPassword": "password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-02 01:04:22.004771+00	500
140	85	admin	BACKUP_FAILED	/api/admin/backup-data	POST	{"confirmPassword": "password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-02 01:07:39.918043+00	500
141	85	admin	BACKUP	/api/admin/backup-data	POST	{"confirmPassword": "password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-02 01:10:41.507962+00	200
142	85	admin	BACKUP	/api/admin/backup-data	POST	{"confirmPassword": "password123"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-12-02 01:23:25.598914+00	200
\.


--
-- Data for Name: borrow_logs; Type: TABLE DATA; Schema: public; Owner: assetone_ams_db_5esl_user
--

COPY public.borrow_logs (id, item_unit_id, borrowed_by, lend_by, borrowed_at, returned_at, status, remarks, purpose, due_date) FROM stdin;
32	422	Carlo	99	2025-11-27 15:58:38.412576+00	2025-11-27 16:22:12.82+00	returned	\N	Pahiram	2025-11-27 15:58:38.412576+00
\.


--
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: assetone_ams_db_5esl_user
--

COPY public.departments (id, name, created_by, updated_by, deleted_by, created_at, updated_at, deleted_at, code) FROM stdin;
28	College of Computer Studies	86	86	86	2025-11-20 03:04:38.745578+00	2025-11-25 03:21:50.212+00	2025-11-25 03:21:50.212+00	CCS
21	General Services Office	86	86	86	2025-11-20 01:36:26.341323+00	2025-11-25 03:25:13.897+00	2025-11-25 03:25:13.897+00	GSO
16	IT Department	74	86	\N	2025-11-12 03:01:04.317407+00	2025-11-25 06:41:25.879+00	\N	ITSS
\.


--
-- Data for Name: item_attachments; Type: TABLE DATA; Schema: public; Owner: assetone_ams_db_5esl_user
--

COPY public.item_attachments (id, item_id, file_name, file_path, mime_type, context, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: item_categories; Type: TABLE DATA; Schema: public; Owner: assetone_ams_db_5esl_user
--

COPY public.item_categories (id, name, code, created_by, updated_by, deleted_by, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: item_costs; Type: TABLE DATA; Schema: public; Owner: assetone_ams_db_5esl_user
--

COPY public.item_costs (id, item_unit_id, purchase_price, additional_cost, total_cost, created_at, updated_at) FROM stdin;
292	297	25000.00	\N	\N	2025-11-04 20:58:52.231525+00	2025-11-04 20:58:52.231525+00
293	298	2001.00	\N	\N	2025-11-04 21:14:26.394977+00	2025-11-04 21:14:26.394977+00
294	299	2001.00	\N	\N	2025-11-04 21:14:26.405403+00	2025-11-04 21:14:26.405403+00
295	300	2001.00	\N	\N	2025-11-04 21:14:26.410698+00	2025-11-04 21:14:26.410698+00
296	301	2001.00	\N	\N	2025-11-04 21:14:26.415881+00	2025-11-04 21:14:26.415881+00
297	302	2001.00	\N	\N	2025-11-04 21:14:26.422364+00	2025-11-04 21:14:26.422364+00
298	303	20000.00	\N	\N	2025-11-06 12:00:05.853873+00	2025-11-06 12:00:05.853873+00
299	304	20000.00	\N	\N	2025-11-06 12:00:05.879929+00	2025-11-06 12:00:05.879929+00
300	305	20000.00	\N	\N	2025-11-06 12:00:05.897845+00	2025-11-06 12:00:05.897845+00
301	306	20000.00	\N	\N	2025-11-06 12:00:05.932367+00	2025-11-06 12:00:05.932367+00
302	307	20000.00	\N	\N	2025-11-06 12:00:05.954457+00	2025-11-06 12:00:05.954457+00
303	308	5.00	\N	\N	2025-11-10 15:19:57.051928+00	2025-11-10 15:19:57.051928+00
\.


--
-- Data for Name: item_depreciation; Type: TABLE DATA; Schema: public; Owner: assetone_ams_db_5esl_user
--

COPY public.item_depreciation (id, item_unit_id, method, purchase_date, rate, useful_life, accumulated_depreciation, updated_by, updated_at) FROM stdin;
295	297	straight_line	2024-10-09	0.20	5	0.00	\N	2025-11-04 20:58:52.219857+00
296	298	\N	\N	\N	5	0.00	\N	2025-11-04 21:14:26.392321+00
297	299	\N	\N	\N	5	0.00	\N	2025-11-04 21:14:26.404364+00
298	300	\N	\N	\N	5	0.00	\N	2025-11-04 21:14:26.409812+00
299	301	\N	\N	\N	5	0.00	\N	2025-11-04 21:14:26.414988+00
300	302	\N	\N	\N	5	0.00	\N	2025-11-04 21:14:26.421467+00
301	303	straight_line	2025-10-30	0.20	5	0.00	\N	2025-11-06 12:00:05.817764+00
302	304	straight_line	2025-10-30	0.20	5	0.00	\N	2025-11-06 12:00:05.870313+00
303	305	straight_line	2025-10-30	0.20	5	0.00	\N	2025-11-06 12:00:05.896925+00
304	306	straight_line	2025-10-30	0.20	5	0.00	\N	2025-11-06 12:00:05.931412+00
305	307	straight_line	2025-10-30	0.20	5	0.00	\N	2025-11-06 12:00:05.953508+00
306	308	\N	2020-10-27	\N	\N	0.00	\N	2025-11-10 15:19:56.957418+00
\.


--
-- Data for Name: item_lifecycle; Type: TABLE DATA; Schema: public; Owner: assetone_ams_db_5esl_user
--

COPY public.item_lifecycle (id, item_unit_id, total_cost, maintenance_cost, repair_cost, updated_at) FROM stdin;
\.


--
-- Data for Name: item_requests; Type: TABLE DATA; Schema: public; Owner: assetone_ams_db_5esl_user
--

COPY public.item_requests (id, item_id, quantity, reason, remarks, status, date_required, requested_by, requested_at, reviewed_by, reviewed_at) FROM stdin;
\.


--
-- Data for Name: item_units; Type: TABLE DATA; Schema: public; Owner: assetone_ams_db_5esl_user
--

COPY public.item_units (id, item_id, serial_number, unit_tag, specifications, sub_location_id, is_legacy, owner_department_id, created_by, updated_by, deleted_by, created_at, updated_at, deleted_at, vendor_id, brand, condition, purchase_date, purchase_cost, status) FROM stdin;
422	54	ABC123	GSO-ELEC-0001	\N	47	f	21	86	86	\N	2025-11-27 11:44:44.573793+00	2025-11-27 16:22:12.983+00	\N	24	HP	80	2024-11-26 00:00:00+00	10000.00	available
424	56	asda	GSO-ELEC-0003	\N	31	f	\N	86	86	\N	2025-12-01 23:17:17.799352+00	2025-12-01 23:17:17.799352+00	\N	25	asd	100	2025-12-02 00:00:00+00	3214.00	available
423	54	ABC123	GSO-ELEC-0002	\N	52	f	\N	86	86	\N	2025-11-28 16:02:37.794678+00	2025-11-28 16:02:37.794678+00	\N	28	hehe	100	2025-11-29 00:00:00+00	5000.00	available
\.


--
-- Data for Name: items; Type: TABLE DATA; Schema: public; Owner: assetone_ams_db_5esl_user
--

COPY public.items (id, name, department_id, created_by, updated_by, deleted_by, created_at, updated_at, deleted_at, useful_life, rul_percentage, performance_percentage, physical_percentage, rul_multiplier, performance_multiplier, physical_multiplier, category) FROM stdin;
54	Aircon	21	86	86	\N	2025-11-27 11:43:41.989824+00	2025-11-27 11:43:51.221+00	\N	5	33	33	34	1.0	1.0	1.0	Appliances / Electronics
55	asd	28	86	86	\N	2025-12-01 01:04:14.880167+00	2025-12-01 01:04:14.880167+00	\N	\N	33	33	34	1.0	1.0	1.0	Furniture
56	ge	\N	86	86	\N	2025-12-01 22:32:27.270712+00	2025-12-01 22:36:43.043+00	\N	5	33	33	34	1.0	1.0	1.0	Appliances / Electronics
57	asdasd	\N	86	86	\N	2025-12-01 23:55:19.051358+00	2025-12-01 23:55:19.051358+00	\N	\N	33	33	34	1.0	1.0	1.0	Appliances / Electronics
\.


--
-- Data for Name: items_for_distribution; Type: TABLE DATA; Schema: public; Owner: assetone_ams_db_5esl_user
--

COPY public.items_for_distribution (id, purchase_request_id, item_unit_id, received_at) FROM stdin;
108	20	298	\N
109	20	299	\N
110	20	300	\N
111	20	301	\N
112	20	302	\N
\.


--
-- Data for Name: locations; Type: TABLE DATA; Schema: public; Owner: assetone_ams_db_5esl_user
--

COPY public.locations (id, name, created_by, updated_by, deleted_by, created_at, updated_at, deleted_at) FROM stdin;
8	Aula Magna	74	74	\N	2025-11-12 02:46:54.87916+00	2025-11-12 02:46:54.87916+00	\N
10	Building A	86	86	\N	2025-11-19 23:59:10.821963+00	2025-11-19 23:59:10.821963+00	\N
11	Building B	86	86	\N	2025-11-20 00:00:51.55515+00	2025-11-20 00:00:51.55515+00	\N
12	Building C	86	86	\N	2025-11-20 00:01:44.364224+00	2025-11-20 00:01:44.364224+00	\N
\.


--
-- Data for Name: maintenance_history; Type: TABLE DATA; Schema: public; Owner: assetone_ams_db_5esl_user
--

COPY public.maintenance_history (id, item_unit_id, occurrence_id, performed_by, maintenance_type, description, performed_at) FROM stdin;
\.


--
-- Data for Name: maintenance_requests; Type: TABLE DATA; Schema: public; Owner: assetone_ams_db_5esl_user
--

COPY public.maintenance_requests (id, item_unit_id, status, description, requested_by, requested_at, reviewed_by, reviewed_at, requestor_name) FROM stdin;
17	423	pending	asd	carlo123@gmail.com	2025-11-23 10:49:07.458498+00	\N	\N	asd asd
13	423	pending	geg	gegeg@geg.geg	2025-11-23 09:14:06.262431+00	\N	\N	geg ege
14	423	pending	asd	marwin123@gmail.com	2025-11-23 10:38:54.555401+00	\N	\N	as asd
15	423	pending	sad	gegeg@geg.geg	2025-11-23 10:39:17.831308+00	\N	\N	asd asd
16	423	pending	geg	ge.geg@geg.ge	2025-11-23 10:47:56.776752+00	\N	\N	gege gege
18	424	approved	geeg	123@123.123	2025-12-01 23:18:31.466797+00	\N	\N	eg asd
\.


--
-- Data for Name: notification_receivers; Type: TABLE DATA; Schema: public; Owner: assetone_ams_db_5esl_user
--

COPY public.notification_receivers (id, notification_id, user_id, seen_at) FROM stdin;
4	7	99	2025-11-27 16:57:10.142081+00
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: assetone_ams_db_5esl_user
--

COPY public.notifications (id, module, message, created_at) FROM stdin;
3	item-unit	Item was transferred to your department	2025-11-26 15:20:35.310633+00
4	item-unit	Item was transferred to your department	2025-11-26 16:12:23.348403+00
5	item-unit	Item was transferred to your department	2025-11-26 16:13:06.088757+00
6	item-unit	Item was transferred to your department	2025-11-26 16:17:14.884219+00
7	item-unit	Item was transferred to your department	2025-11-27 15:55:48.734445+00
\.


--
-- Data for Name: password_reset_tokens; Type: TABLE DATA; Schema: public; Owner: assetone_ams_db_5esl_user
--

COPY public.password_reset_tokens (id, user_id, token_hash, expires_at, used, created_at) FROM stdin;
\.


--
-- Data for Name: pending_registration; Type: TABLE DATA; Schema: public; Owner: assetone_ams_db_5esl_user
--

COPY public.pending_registration (id, first_name, last_name, email, status, created_at, updated_at, department_id, approved_by) FROM stdin;
23	John Marwin	Castillo	johnmarwin941@gmail.com	pending	2025-11-15 04:13:46.311314	2025-12-01 23:52:17.342251	\N	86
18	Rowell	Cruz	cruzrowellt11@gmail.com	pending	2025-11-14 12:24:29.789938	2025-11-19 23:17:20.790416	\N	\N
21	Rowell	Cruz	first.acc145@gmail.com	pending	2025-11-14 13:11:55.256359	2025-11-27 08:26:39.832479	\N	86
19	Rowell	Cruz	rowellcruz145@gmail.com	pending	2025-11-14 13:05:43.031522	2025-11-27 08:28:39.677433	\N	86
22	Rowell	Cruz	cruz.rowell00510@gmail.com	pending	2025-11-14 13:14:45.894266	2025-11-27 08:29:18.518741	\N	86
20	Rowell	Cruz	cruz.rowell00510@dyci.edu.ph	pending	2025-11-14 13:10:32.676838	2025-11-27 08:31:34.493482	\N	86
24	Rowell	Cruz	zaravoc5@gmail.com	pending	2025-11-27 15:10:26.402263	2025-11-27 15:18:14.216462	\N	86
25	asd	asda	asd@asd.asd	approved	2025-12-01 02:28:47.178043	2025-12-01 23:54:14.844386	\N	86
\.


--
-- Data for Name: pr_sequences; Type: TABLE DATA; Schema: public; Owner: assetone_ams_db_5esl_user
--

COPY public.pr_sequences (date_key, seq) FROM stdin;
20251104	1
\.


--
-- Data for Name: procurement_attachments; Type: TABLE DATA; Schema: public; Owner: assetone_ams_db_5esl_user
--

COPY public.procurement_attachments (id, purchase_request_id, file_name, file_path, uploaded_at, updated_at, mime_type, uploaded_by, module) FROM stdin;
40	20	purchase-requisition-20.pdf	1762290765556-971311466.pdf	2025-11-04 21:12:45.562979+00	2025-11-04 21:12:45.562979+00	application/pdf	2	approved_prf
41	20	stickers.pdf	1762290813965-132211168.pdf	2025-11-04 21:13:34.020998+00	2025-11-04 21:13:34.020998+00	application/pdf	2	approved_pof
\.


--
-- Data for Name: procurement_finalizations; Type: TABLE DATA; Schema: public; Owner: assetone_ams_db_5esl_user
--

COPY public.procurement_finalizations (id, purchase_order_id, finalized_at, remarks) FROM stdin;
\.


--
-- Data for Name: purchase_order_items; Type: TABLE DATA; Schema: public; Owner: assetone_ams_db_5esl_user
--

COPY public.purchase_order_items (id, purchase_order_id, item_name, quantity, unit_price, specifications, created_at, updated_at, brand, acquired_date, useful_life) FROM stdin;
11	30	Laptop	5	2001.00	RAM:32 GB	2025-11-05 05:13:36.501142	2025-11-05 05:13:36.501142	HP	2025-11-04 21:14:26.314+00	\N
\.


--
-- Data for Name: purchase_orders; Type: TABLE DATA; Schema: public; Owner: assetone_ams_db_5esl_user
--

COPY public.purchase_orders (id, po_number, vendor_id, created_at, updated_at, purchase_request_id, status, delivered_at) FROM stdin;
30	\N	11	2025-11-04 21:13:36.498598+00	2025-11-04 21:14:28.539+00	20	delivered	2025-11-04 21:14:28.539+00
\.


--
-- Data for Name: purchase_requests; Type: TABLE DATA; Schema: public; Owner: assetone_ams_db_5esl_user
--

COPY public.purchase_requests (id, control_number, date_required, requested_by, requested_at, status, item_category_id, reason, remarks, reviewed_by, reviewed_at, updated_at, updated_by, planned_cost) FROM stdin;
20	PR-20251104-0001	2025-11-26 21:11:00+00	2	2025-11-04 21:12:03.508+00	for_distribution	5	For stock	\N	\N	\N	2025-11-04 21:14:28.477+00	2	5000.00
\.


--
-- Data for Name: relocation_log; Type: TABLE DATA; Schema: public; Owner: assetone_ams_db_5esl_user
--

COPY public.relocation_log (id, item_unit_id, from_sub_location_id, to_sub_location_id, created_by, completed_by, created_at) FROM stdin;
24	422	31	44	86	\N	2025-11-27 11:53:33.928216
25	422	44	31	86	\N	2025-11-27 11:56:17.826032
26	422	31	55	86	\N	2025-11-27 11:58:08.769249
27	422	31	51	86	\N	2025-11-27 11:58:58.962999
28	422	51	47	86	\N	2025-11-27 12:03:23.187798
\.


--
-- Data for Name: relocation_technicians; Type: TABLE DATA; Schema: public; Owner: assetone_ams_db_5esl_user
--

COPY public.relocation_technicians (id, relocation_log_id, user_id) FROM stdin;
4	15	68
\.


--
-- Data for Name: requested_items; Type: TABLE DATA; Schema: public; Owner: assetone_ams_db_5esl_user
--

COPY public.requested_items (id, purchase_request_id, item_description, quantity) FROM stdin;
20	20	Laptop	5
\.


--
-- Data for Name: schedule_occurrences; Type: TABLE DATA; Schema: public; Owner: assetone_ams_db_5esl_user
--

COPY public.schedule_occurrences (id, template_id, scheduled_date, status, review_remarks, skipped_reason, created_by, updated_by, started_by, completed_by, skipped_by, reviewed_by, created_at, updated_at, started_at, completed_at, skipped_at, reviewed_at) FROM stdin;
152	105	2025-10-31 16:00:00+00	pending	\N	\N	\N	\N	\N	\N	\N	\N	2025-11-27 11:43:42.671328+00	2025-11-27 11:43:42.671328+00	\N	\N	\N	\N
151	104	2025-11-30 16:00:00+00	completed	\N	\N	\N	\N	86	\N	\N	\N	2025-11-27 11:43:42.335911+00	2025-11-27 11:43:42.335911+00	2025-11-27 12:07:19.421+00	2025-11-27 13:09:52.441+00	\N	\N
153	104	2025-12-14 16:00:00+00	completed	\N	\N	\N	\N	86	94	\N	\N	2025-11-27 13:09:53.255805+00	2025-11-27 13:09:53.255805+00	2025-11-27 13:10:00.635+00	2025-11-27 13:11:04.521+00	\N	\N
154	104	2026-01-04 16:00:00+00	in_progress	\N	\N	\N	\N	86	\N	\N	\N	2025-11-27 13:11:05.359015+00	2025-11-27 13:11:05.359015+00	2025-11-27 13:16:46.809+00	\N	\N	\N
155	106	2025-12-14 16:00:00+00	pending	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-01 01:04:15.216537+00	2025-12-01 01:04:15.216537+00	\N	\N	\N	\N
156	107	2025-11-30 16:00:00+00	pending	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-01 01:04:15.541249+00	2025-12-01 01:04:15.541249+00	\N	\N	\N	\N
157	108	2025-12-14 16:00:00+00	pending	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-01 22:32:27.608488+00	2025-12-01 22:32:27.608488+00	\N	\N	\N	\N
158	109	2025-11-30 16:00:00+00	pending	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-01 22:32:28.08121+00	2025-12-01 22:32:28.08121+00	\N	\N	\N	\N
159	110	2025-12-02 07:18:00+00	pending	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-01 23:18:44.344241+00	2025-12-01 23:18:44.344241+00	\N	\N	\N	\N
160	111	2025-12-14 16:00:00+00	pending	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-01 23:55:19.386064+00	2025-12-01 23:55:19.386064+00	\N	\N	\N	\N
161	112	2025-11-30 16:00:00+00	pending	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-01 23:55:19.716441+00	2025-12-01 23:55:19.716441+00	\N	\N	\N	\N
\.


--
-- Data for Name: schedule_technicians; Type: TABLE DATA; Schema: public; Owner: assetone_ams_db_5esl_user
--

COPY public.schedule_technicians (id, occurrence_id, user_id, assigned_at) FROM stdin;
80	151	92	2025-11-27 12:07:20.578883+00
81	151	93	2025-11-27 12:07:20.578883+00
82	153	92	2025-11-27 13:10:01.451649+00
83	153	93	2025-11-27 13:10:01.451649+00
84	154	92	2025-11-27 13:16:48.049222+00
85	154	93	2025-11-27 13:16:48.049222+00
\.


--
-- Data for Name: schedule_templates; Type: TABLE DATA; Schema: public; Owner: assetone_ams_db_5esl_user
--

COPY public.schedule_templates (id, type, title, description, frequency_value, frequency_unit, grace_period_value, grace_period_unit, status, start_date, end_date, created_by, updated_by, stopped_by, created_at, updated_at, stopped_at, item_id, item_unit_id) FROM stdin;
104	PM	\N	Preventive Maintenance for Aircon	\N	\N	\N	\N	active	2025-11-30 16:00:00+00	\N	\N	\N	\N	2025-11-27 11:43:42.156636+00	\N	\N	54	\N
105	ACA	\N	Monthly Aircon condition assessment	\N	\N	\N	\N	active	2025-10-31 16:00:00+00	\N	\N	\N	\N	2025-11-27 11:43:42.504837+00	\N	\N	54	\N
106	PM	\N	Preventive Maintenance for asd	\N	\N	\N	\N	active	2025-12-14 16:00:00+00	\N	\N	\N	\N	2025-12-01 01:04:15.054321+00	\N	\N	55	\N
107	ACA	\N	Monthly asd condition assessment	\N	\N	\N	\N	active	2025-11-30 16:00:00+00	\N	\N	\N	\N	2025-12-01 01:04:15.376622+00	\N	\N	55	\N
108	PM	\N	Preventive Maintenance for ge	\N	\N	\N	\N	active	2025-12-14 16:00:00+00	\N	\N	\N	\N	2025-12-01 22:32:27.438194+00	\N	\N	56	\N
109	ACA	\N	Monthly ge condition assessment	\N	\N	\N	\N	active	2025-11-30 16:00:00+00	\N	\N	\N	\N	2025-12-01 22:32:27.846467+00	\N	\N	56	\N
110	CM	\N	Repair required for ge	\N	\N	\N	\N	active	2025-12-02 07:18:00+00	\N	86	86	\N	2025-12-01 23:18:44.182207+00	2025-12-01 23:18:44.126+00	\N	56	424
111	PM	\N	Preventive Maintenance for asdasd	\N	\N	\N	\N	active	2025-12-14 16:00:00+00	\N	\N	\N	\N	2025-12-01 23:55:19.219094+00	\N	\N	57	\N
112	ACA	\N	Monthly asdasd condition assessment	\N	\N	\N	\N	active	2025-11-30 16:00:00+00	\N	\N	\N	\N	2025-12-01 23:55:19.551342+00	\N	\N	57	\N
\.


--
-- Data for Name: schedule_units; Type: TABLE DATA; Schema: public; Owner: assetone_ams_db_5esl_user
--

COPY public.schedule_units (id, occurrence_id, item_unit_id, status, review, condition, completed_at, completed_by) FROM stdin;
311	151	422	completed	\N	60	2025-11-27 12:07:47.135786+00	\N
312	153	422	completed	\N	80	2025-11-27 13:11:03.061021+00	94
313	154	422	pending	\N	100	\N	\N
\.


--
-- Data for Name: sub_locations; Type: TABLE DATA; Schema: public; Owner: assetone_ams_db_5esl_user
--

COPY public.sub_locations (id, location_id, name, created_by, updated_by, deleted_by, created_at, updated_at, deleted_at) FROM stdin;
31	8	Room 101	74	74	\N	2025-11-12 02:46:54.87916+00	2025-11-12 02:46:54.87916+00	\N
37	10	Archive Room	86	86	\N	2025-11-19 23:59:10.821963+00	2025-11-19 23:59:10.821963+00	\N
38	10	HR	86	86	\N	2025-11-19 23:59:10.821963+00	2025-11-19 23:59:10.821963+00	\N
39	10	QMS	86	86	\N	2025-11-19 23:59:10.821963+00	2025-11-19 23:59:10.821963+00	\N
40	10	VFAD	86	86	\N	2025-11-19 23:59:10.821963+00	2025-11-19 23:59:10.821963+00	\N
41	10	Registrar	86	86	\N	2025-11-19 23:59:10.821963+00	2025-11-19 23:59:10.821963+00	\N
42	10	101	86	86	\N	2025-11-19 23:59:10.821963+00	2025-11-19 23:59:10.821963+00	\N
43	10	Purchasing	86	86	\N	2025-11-19 23:59:10.821963+00	2025-11-19 23:59:10.821963+00	\N
44	10	Paraya / NSTP	86	86	\N	2025-11-19 23:59:10.821963+00	2025-11-19 23:59:10.821963+00	\N
45	10	OSAS	86	86	\N	2025-11-19 23:59:10.821963+00	2025-11-19 23:59:10.821963+00	\N
46	10	SSC	86	86	\N	2025-11-19 23:59:10.821963+00	2025-11-19 23:59:10.821963+00	\N
47	10	Cashier	86	86	\N	2025-11-19 23:59:10.821963+00	2025-11-19 23:59:10.821963+00	\N
48	11	Room 102	86	86	\N	2025-11-20 00:00:51.55515+00	2025-11-20 00:00:51.55515+00	\N
49	11	Room 103	86	86	\N	2025-11-20 00:00:51.55515+00	2025-11-20 00:00:51.55515+00	\N
50	11	Room 104	86	86	\N	2025-11-20 00:00:51.55515+00	2025-11-20 00:00:51.55515+00	\N
51	11	Room 105	86	86	\N	2025-11-20 00:00:51.55515+00	2025-11-20 00:00:51.55515+00	\N
52	11	Room 202	86	86	\N	2025-11-20 00:00:51.55515+00	2025-11-20 00:00:51.55515+00	\N
53	11	Room 203	86	86	\N	2025-11-20 00:00:51.55515+00	2025-11-20 00:00:51.55515+00	\N
54	11	Room 204	86	86	\N	2025-11-20 00:00:51.55515+00	2025-11-20 00:00:51.55515+00	\N
55	11	Room 205	86	86	\N	2025-11-20 00:00:51.55515+00	2025-11-20 00:00:51.55515+00	\N
56	12	Audio Visual Room	86	86	\N	2025-11-20 00:01:44.364224+00	2025-11-20 00:01:44.364224+00	\N
57	12	CCS	86	86	\N	2025-11-20 00:01:44.364224+00	2025-11-20 00:01:44.364224+00	\N
58	12	CBA	86	86	\N	2025-11-20 00:01:44.364224+00	2025-11-20 00:01:44.364224+00	\N
59	12	SOP	86	86	\N	2025-11-20 00:01:44.364224+00	2025-11-20 00:01:44.364224+00	\N
60	12	CAS	86	86	\N	2025-11-20 00:01:44.364224+00	2025-11-20 00:01:44.364224+00	\N
61	12	COED	86	86	\N	2025-11-20 00:01:44.364224+00	2025-11-20 00:01:44.364224+00	\N
62	12	COA	86	86	\N	2025-11-20 00:01:44.364224+00	2025-11-20 00:01:44.364224+00	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: assetone_ams_db_5esl_user
--

COPY public.users (id, first_name, last_name, email, password, role, department_id, status, created_by, updated_by, disabled_by, deleted_by, created_at, updated_at, disabled_at, deleted_at, is_password_updated) FROM stdin;
85	System	Admin	samms.dyci@gmail.com	$2b$10$HjvEx1MmXUfYdujVeSjulOxJZNPefgAcnPCxPUgcYT/RMVDo/inw.	system_administrator	\N	active	1	1	\N	\N	2025-10-16 10:13:18.932041+00	2025-10-16 03:03:52.015+00	2025-10-16 03:03:52.015+00	\N	t
100	asd	asda	asd@asd.asd	$2b$10$HjvEx1MmXUfYdujVeSjulOxJZNPefgAcnPCxPUgcYT/RMVDo/inw.	property_custodian	21	inactive	\N	\N	\N	\N	2025-12-01 02:29:07.376268+00	2025-12-01 02:29:07.376268+00	\N	\N	f
95	Rowell	Cruz	cruz.rowell00510@dyci.edu.ph	$2b$10$HjvEx1MmXUfYdujVeSjulOxJZNPefgAcnPCxPUgcYT/RMVDo/inw.	property_custodian	16	inactive	\N	\N	\N	\N	2025-11-27 08:31:34.329253+00	2025-11-27 08:31:34.329253+00	\N	\N	f
99	Rowell	Cruz	zaravoc5@gmail.com	$2b$10$HjvEx1MmXUfYdujVeSjulOxJZNPefgAcnPCxPUgcYT/RMVDo/inw.	property_custodian	21	inactive	\N	\N	\N	\N	2025-11-27 15:18:14.054925+00	2025-11-27 15:18:14.054925+00	\N	\N	t
94	Rowell	Cruz	cruz.rowell00510@gmail.com	$2b$10$HjvEx1MmXUfYdujVeSjulOxJZNPefgAcnPCxPUgcYT/RMVDo/inw.	property_custodian	16	inactive	\N	85	\N	\N	2025-11-27 08:29:18.356837+00	2025-11-28 14:16:48.764+00	\N	\N	t
103	asd	asda	asd@asd.asd	$2b$10$scEeMYOCnuFDdyArrSUv4ejaBblG2W8a5hzedAMAiSm.a5AbLWPfm	technician	\N	inactive	\N	\N	\N	\N	2025-12-01 23:54:14.684543+00	2025-12-01 23:54:14.684543+00	\N	\N	f
86	Rowell	Cruz	cruzrowellt11@gmail.com	$2b$10$HjvEx1MmXUfYdujVeSjulOxJZNPefgAcnPCxPUgcYT/RMVDo/inw.	asset_administrator	\N	inactive	\N	85	\N	\N	2025-11-19 23:17:20.63119+00	2025-11-27 07:34:39.962+00	\N	\N	t
\.


--
-- Data for Name: vendor_offers; Type: TABLE DATA; Schema: public; Owner: assetone_ams_db_5esl_user
--

COPY public.vendor_offers (id, vendor_id, item_category_id, item_id, offer_details, price, valid_until, created_at, updated_at) FROM stdin;
36	16	8	\N	\N	\N	\N	2025-11-04 21:04:01.939605+00	2025-11-04 21:04:01.939605+00
37	16	9	\N	\N	\N	\N	2025-11-04 21:04:01.939605+00	2025-11-04 21:04:01.939605+00
40	12	4	\N	\N	\N	\N	2025-11-04 21:05:09.771769+00	2025-11-04 21:05:09.771769+00
41	12	5	\N	\N	\N	\N	2025-11-04 21:05:09.771769+00	2025-11-04 21:05:09.771769+00
42	12	4	\N	\N	\N	\N	2025-11-04 21:05:09.772078+00	2025-11-04 21:05:09.772078+00
43	12	5	\N	\N	\N	\N	2025-11-04 21:05:09.772078+00	2025-11-04 21:05:09.772078+00
\.


--
-- Data for Name: vendors; Type: TABLE DATA; Schema: public; Owner: assetone_ams_db_5esl_user
--

COPY public.vendors (id, name, contact_person, contact_email, contact_phone, address, created_by, updated_by, deleted_by, created_at, updated_at, deleted_at) FROM stdin;
24	OfficePro Supplies	Juan Dela Cruz	juan.delacruz@officepro.ph	+63 923 456 7890	45 Makati Ave, Makati City, Philippines	1	1	\N	2025-11-14 04:15:08.679088+00	2025-11-14 04:15:08.679088+00	\N
25	ElectroHub	Angela Reyes	angela.reyes@electrohub.com	+63 934 567 8901	78 Electronics St, Pasig City, Philippines	1	1	\N	2025-11-14 04:15:08.679088+00	2025-11-14 04:15:08.679088+00	\N
26	FurnitureWorld	Ramon Santos	ramon.santos@furnitureworld.ph	+63 945 678 9012	12 Furniture Rd, Mandaluyong City, Philippines	1	1	\N	2025-11-14 04:15:08.679088+00	2025-11-14 04:15:08.679088+00	\N
27	Mechanical Masters	Lito Navarro	lito.navarro@mechmasters.ph	+63 956 789 0123	34 Mechanics Lane, Taguig City, Philippines	1	1	\N	2025-11-14 04:15:08.679088+00	2025-11-14 04:15:08.679088+00	\N
28	Peripherals Plus	Grace Tan	grace.tan@peripheralsplus.com	+63 967 890 1234	56 Tech Blvd, Quezon City, Philippines	1	1	\N	2025-11-14 04:15:08.679088+00	2025-11-14 04:15:08.679088+00	\N
30	Tools & Equipment Ph	Melissa Cruz	melissa.cruz@toolsph.com	+63 989 012 3456	23 Industrial Ave, Makati City, Philippines	1	1	\N	2025-11-14 04:15:08.679088+00	2025-11-14 04:15:08.679088+00	\N
31	Appliances Central	Ricardo Villanueva	ricardo.villanueva@appliancescentral.ph	+63 990 123 4567	67 Appliance St, Mandaluyong City, Philippines	1	1	\N	2025-11-14 04:15:08.679088+00	2025-11-14 04:15:08.679088+00	\N
23	Tech Solutions Inc.	Maria Lopez	maria.lopez@techsolutions.com	+63 912 345 6789	123 IT Park, Quezon City, Philippines	1	86	\N	2025-11-14 04:15:08.679088+00	2025-11-20 02:05:06.49+00	\N
29	Green Energy Co.	Carlos Mendoza	carlos.mendoza@greenenergy.ph	+63 978 901 2345	89 Solar Park, Pasig City, Philippines	1	86	\N	2025-11-14 04:15:08.679088+00	2025-11-25 06:49:15.99+00	\N
\.


--
-- Name: activity_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: assetone_ams_db_5esl_user
--

SELECT pg_catalog.setval('public.activity_log_id_seq', 142, true);


--
-- Name: borrow_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: assetone_ams_db_5esl_user
--

SELECT pg_catalog.setval('public.borrow_logs_id_seq', 32, true);


--
-- Name: departments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: assetone_ams_db_5esl_user
--

SELECT pg_catalog.setval('public.departments_id_seq', 28, true);


--
-- Name: item_attachments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: assetone_ams_db_5esl_user
--

SELECT pg_catalog.setval('public.item_attachments_id_seq', 1, false);


--
-- Name: item_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: assetone_ams_db_5esl_user
--

SELECT pg_catalog.setval('public.item_categories_id_seq', 13, true);


--
-- Name: item_costs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: assetone_ams_db_5esl_user
--

SELECT pg_catalog.setval('public.item_costs_id_seq', 303, true);


--
-- Name: item_depreciation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: assetone_ams_db_5esl_user
--

SELECT pg_catalog.setval('public.item_depreciation_id_seq', 306, true);


--
-- Name: item_lifecycle_id_seq; Type: SEQUENCE SET; Schema: public; Owner: assetone_ams_db_5esl_user
--

SELECT pg_catalog.setval('public.item_lifecycle_id_seq', 1, false);


--
-- Name: item_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: assetone_ams_db_5esl_user
--

SELECT pg_catalog.setval('public.item_requests_id_seq', 1, false);


--
-- Name: item_units_id_seq; Type: SEQUENCE SET; Schema: public; Owner: assetone_ams_db_5esl_user
--

SELECT pg_catalog.setval('public.item_units_id_seq', 424, true);


--
-- Name: items_for_distribution_id_seq; Type: SEQUENCE SET; Schema: public; Owner: assetone_ams_db_5esl_user
--

SELECT pg_catalog.setval('public.items_for_distribution_id_seq', 112, true);


--
-- Name: items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: assetone_ams_db_5esl_user
--

SELECT pg_catalog.setval('public.items_id_seq', 57, true);


--
-- Name: locations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: assetone_ams_db_5esl_user
--

SELECT pg_catalog.setval('public.locations_id_seq', 13, true);


--
-- Name: maintenance_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: assetone_ams_db_5esl_user
--

SELECT pg_catalog.setval('public.maintenance_history_id_seq', 1, false);


--
-- Name: maintenance_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: assetone_ams_db_5esl_user
--

SELECT pg_catalog.setval('public.maintenance_requests_id_seq', 18, true);


--
-- Name: notification_receivers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: assetone_ams_db_5esl_user
--

SELECT pg_catalog.setval('public.notification_receivers_id_seq', 4, true);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: assetone_ams_db_5esl_user
--

SELECT pg_catalog.setval('public.notifications_id_seq', 7, true);


--
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: assetone_ams_db_5esl_user
--

SELECT pg_catalog.setval('public.password_reset_tokens_id_seq', 29, true);


--
-- Name: pending_registration_id_seq; Type: SEQUENCE SET; Schema: public; Owner: assetone_ams_db_5esl_user
--

SELECT pg_catalog.setval('public.pending_registration_id_seq', 25, true);


--
-- Name: procurement_attachments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: assetone_ams_db_5esl_user
--

SELECT pg_catalog.setval('public.procurement_attachments_id_seq', 41, true);


--
-- Name: procurement_finalizations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: assetone_ams_db_5esl_user
--

SELECT pg_catalog.setval('public.procurement_finalizations_id_seq', 1, false);


--
-- Name: purchase_order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: assetone_ams_db_5esl_user
--

SELECT pg_catalog.setval('public.purchase_order_items_id_seq', 11, true);


--
-- Name: purchase_orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: assetone_ams_db_5esl_user
--

SELECT pg_catalog.setval('public.purchase_orders_id_seq', 30, true);


--
-- Name: purchase_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: assetone_ams_db_5esl_user
--

SELECT pg_catalog.setval('public.purchase_requests_id_seq', 20, true);


--
-- Name: relocation_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: assetone_ams_db_5esl_user
--

SELECT pg_catalog.setval('public.relocation_log_id_seq', 28, true);


--
-- Name: relocation_technicians_id_seq; Type: SEQUENCE SET; Schema: public; Owner: assetone_ams_db_5esl_user
--

SELECT pg_catalog.setval('public.relocation_technicians_id_seq', 4, true);


--
-- Name: requested_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: assetone_ams_db_5esl_user
--

SELECT pg_catalog.setval('public.requested_items_id_seq', 20, true);


--
-- Name: schedule_occurrences_id_seq; Type: SEQUENCE SET; Schema: public; Owner: assetone_ams_db_5esl_user
--

SELECT pg_catalog.setval('public.schedule_occurrences_id_seq', 161, true);


--
-- Name: schedule_technicians_id_seq; Type: SEQUENCE SET; Schema: public; Owner: assetone_ams_db_5esl_user
--

SELECT pg_catalog.setval('public.schedule_technicians_id_seq', 85, true);


--
-- Name: schedule_templates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: assetone_ams_db_5esl_user
--

SELECT pg_catalog.setval('public.schedule_templates_id_seq', 112, true);


--
-- Name: schedule_units_id_seq; Type: SEQUENCE SET; Schema: public; Owner: assetone_ams_db_5esl_user
--

SELECT pg_catalog.setval('public.schedule_units_id_seq', 313, true);


--
-- Name: sub_locations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: assetone_ams_db_5esl_user
--

SELECT pg_catalog.setval('public.sub_locations_id_seq', 64, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: assetone_ams_db_5esl_user
--

SELECT pg_catalog.setval('public.users_id_seq', 103, true);


--
-- Name: vendor_offers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: assetone_ams_db_5esl_user
--

SELECT pg_catalog.setval('public.vendor_offers_id_seq', 43, true);


--
-- Name: vendors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: assetone_ams_db_5esl_user
--

SELECT pg_catalog.setval('public.vendors_id_seq', 32, true);


--
-- Name: activity_log activity_log_pkey; Type: CONSTRAINT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.activity_log
    ADD CONSTRAINT activity_log_pkey PRIMARY KEY (id);


--
-- Name: borrow_logs borrow_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.borrow_logs
    ADD CONSTRAINT borrow_logs_pkey PRIMARY KEY (id);


--
-- Name: departments departments_code_key; Type: CONSTRAINT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_code_key UNIQUE (code);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- Name: item_attachments item_attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.item_attachments
    ADD CONSTRAINT item_attachments_pkey PRIMARY KEY (id);


--
-- Name: item_categories item_categories_code_key; Type: CONSTRAINT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.item_categories
    ADD CONSTRAINT item_categories_code_key UNIQUE (code);


--
-- Name: item_categories item_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.item_categories
    ADD CONSTRAINT item_categories_pkey PRIMARY KEY (id);


--
-- Name: item_costs item_costs_pkey; Type: CONSTRAINT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.item_costs
    ADD CONSTRAINT item_costs_pkey PRIMARY KEY (id);


--
-- Name: item_depreciation item_depreciation_pkey; Type: CONSTRAINT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.item_depreciation
    ADD CONSTRAINT item_depreciation_pkey PRIMARY KEY (id);


--
-- Name: item_lifecycle item_lifecycle_pkey; Type: CONSTRAINT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.item_lifecycle
    ADD CONSTRAINT item_lifecycle_pkey PRIMARY KEY (id);


--
-- Name: item_requests item_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.item_requests
    ADD CONSTRAINT item_requests_pkey PRIMARY KEY (id);


--
-- Name: item_units item_units_pkey; Type: CONSTRAINT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.item_units
    ADD CONSTRAINT item_units_pkey PRIMARY KEY (id);


--
-- Name: items_for_distribution items_for_distribution_pkey; Type: CONSTRAINT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.items_for_distribution
    ADD CONSTRAINT items_for_distribution_pkey PRIMARY KEY (id);


--
-- Name: items items_pkey; Type: CONSTRAINT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_pkey PRIMARY KEY (id);


--
-- Name: locations locations_pkey; Type: CONSTRAINT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_pkey PRIMARY KEY (id);


--
-- Name: maintenance_history maintenance_history_pkey; Type: CONSTRAINT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.maintenance_history
    ADD CONSTRAINT maintenance_history_pkey PRIMARY KEY (id);


--
-- Name: maintenance_requests maintenance_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.maintenance_requests
    ADD CONSTRAINT maintenance_requests_pkey PRIMARY KEY (id);


--
-- Name: notification_receivers notification_receivers_pkey; Type: CONSTRAINT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.notification_receivers
    ADD CONSTRAINT notification_receivers_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (id);


--
-- Name: pending_registration pending_registration_email_key; Type: CONSTRAINT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.pending_registration
    ADD CONSTRAINT pending_registration_email_key UNIQUE (email);


--
-- Name: pending_registration pending_registration_pkey; Type: CONSTRAINT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.pending_registration
    ADD CONSTRAINT pending_registration_pkey PRIMARY KEY (id);


--
-- Name: pr_sequences pr_sequences_pkey; Type: CONSTRAINT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.pr_sequences
    ADD CONSTRAINT pr_sequences_pkey PRIMARY KEY (date_key);


--
-- Name: procurement_attachments procurement_attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.procurement_attachments
    ADD CONSTRAINT procurement_attachments_pkey PRIMARY KEY (id);


--
-- Name: procurement_finalizations procurement_finalizations_pkey; Type: CONSTRAINT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.procurement_finalizations
    ADD CONSTRAINT procurement_finalizations_pkey PRIMARY KEY (id);


--
-- Name: purchase_order_items purchase_order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.purchase_order_items
    ADD CONSTRAINT purchase_order_items_pkey PRIMARY KEY (id);


--
-- Name: purchase_orders purchase_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_pkey PRIMARY KEY (id);


--
-- Name: purchase_requests purchase_requests_control_number_key; Type: CONSTRAINT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.purchase_requests
    ADD CONSTRAINT purchase_requests_control_number_key UNIQUE (control_number);


--
-- Name: purchase_requests purchase_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.purchase_requests
    ADD CONSTRAINT purchase_requests_pkey PRIMARY KEY (id);


--
-- Name: relocation_log relocation_log_pkey; Type: CONSTRAINT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.relocation_log
    ADD CONSTRAINT relocation_log_pkey PRIMARY KEY (id);


--
-- Name: relocation_technicians relocation_technicians_pkey; Type: CONSTRAINT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.relocation_technicians
    ADD CONSTRAINT relocation_technicians_pkey PRIMARY KEY (id);


--
-- Name: requested_items requested_items_pkey; Type: CONSTRAINT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.requested_items
    ADD CONSTRAINT requested_items_pkey PRIMARY KEY (id);


--
-- Name: schedule_occurrences schedule_occurrences_pkey; Type: CONSTRAINT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.schedule_occurrences
    ADD CONSTRAINT schedule_occurrences_pkey PRIMARY KEY (id);


--
-- Name: schedule_technicians schedule_technicians_pkey; Type: CONSTRAINT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.schedule_technicians
    ADD CONSTRAINT schedule_technicians_pkey PRIMARY KEY (id);


--
-- Name: schedule_templates schedule_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.schedule_templates
    ADD CONSTRAINT schedule_templates_pkey PRIMARY KEY (id);


--
-- Name: schedule_units schedule_units_pkey; Type: CONSTRAINT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.schedule_units
    ADD CONSTRAINT schedule_units_pkey PRIMARY KEY (id);


--
-- Name: sub_locations sub_locations_pkey; Type: CONSTRAINT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.sub_locations
    ADD CONSTRAINT sub_locations_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: vendor_offers vendor_offers_pkey; Type: CONSTRAINT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.vendor_offers
    ADD CONSTRAINT vendor_offers_pkey PRIMARY KEY (id);


--
-- Name: vendors vendors_pkey; Type: CONSTRAINT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.vendors
    ADD CONSTRAINT vendors_pkey PRIMARY KEY (id);


--
-- Name: idx_password_reset_token_hash; Type: INDEX; Schema: public; Owner: assetone_ams_db_5esl_user
--

CREATE INDEX idx_password_reset_token_hash ON public.password_reset_tokens USING btree (token_hash);


--
-- Name: borrow_logs borrow_logs_item_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.borrow_logs
    ADD CONSTRAINT borrow_logs_item_unit_id_fkey FOREIGN KEY (item_unit_id) REFERENCES public.item_units(id);


--
-- Name: borrow_logs borrow_logs_lend_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.borrow_logs
    ADD CONSTRAINT borrow_logs_lend_by_fkey FOREIGN KEY (lend_by) REFERENCES public.users(id);


--
-- Name: notification_receivers notification_receivers_notification_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.notification_receivers
    ADD CONSTRAINT notification_receivers_notification_id_fkey FOREIGN KEY (notification_id) REFERENCES public.notifications(id) ON DELETE CASCADE;


--
-- Name: notification_receivers notification_receivers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.notification_receivers
    ADD CONSTRAINT notification_receivers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: password_reset_tokens password_reset_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: purchase_order_items purchase_order_items_purchase_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: assetone_ams_db_5esl_user
--

ALTER TABLE ONLY public.purchase_order_items
    ADD CONSTRAINT purchase_order_items_purchase_order_id_fkey FOREIGN KEY (purchase_order_id) REFERENCES public.purchase_orders(id) ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: assetone_ams_db_5esl_user
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;
GRANT ALL ON SCHEMA public TO postgres;


--
-- Name: FUNCTION armor(bytea); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.armor(bytea) TO assetone_ams_db_5esl_user;


--
-- Name: FUNCTION armor(bytea, text[], text[]); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.armor(bytea, text[], text[]) TO assetone_ams_db_5esl_user;


--
-- Name: FUNCTION crypt(text, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.crypt(text, text) TO assetone_ams_db_5esl_user;


--
-- Name: FUNCTION dearmor(text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.dearmor(text) TO assetone_ams_db_5esl_user;


--
-- Name: FUNCTION decrypt(bytea, bytea, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.decrypt(bytea, bytea, text) TO assetone_ams_db_5esl_user;


--
-- Name: FUNCTION decrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.decrypt_iv(bytea, bytea, bytea, text) TO assetone_ams_db_5esl_user;


--
-- Name: FUNCTION digest(bytea, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.digest(bytea, text) TO assetone_ams_db_5esl_user;


--
-- Name: FUNCTION digest(text, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.digest(text, text) TO assetone_ams_db_5esl_user;


--
-- Name: FUNCTION encrypt(bytea, bytea, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.encrypt(bytea, bytea, text) TO assetone_ams_db_5esl_user;


--
-- Name: FUNCTION encrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.encrypt_iv(bytea, bytea, bytea, text) TO assetone_ams_db_5esl_user;


--
-- Name: FUNCTION gen_random_bytes(integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.gen_random_bytes(integer) TO assetone_ams_db_5esl_user;


--
-- Name: FUNCTION gen_random_uuid(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.gen_random_uuid() TO assetone_ams_db_5esl_user;


--
-- Name: FUNCTION gen_salt(text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.gen_salt(text) TO assetone_ams_db_5esl_user;


--
-- Name: FUNCTION gen_salt(text, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.gen_salt(text, integer) TO assetone_ams_db_5esl_user;


--
-- Name: FUNCTION hmac(bytea, bytea, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.hmac(bytea, bytea, text) TO assetone_ams_db_5esl_user;


--
-- Name: FUNCTION hmac(text, text, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.hmac(text, text, text) TO assetone_ams_db_5esl_user;


--
-- Name: FUNCTION pgp_armor_headers(text, OUT key text, OUT value text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgp_armor_headers(text, OUT key text, OUT value text) TO assetone_ams_db_5esl_user;


--
-- Name: FUNCTION pgp_key_id(bytea); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgp_key_id(bytea) TO assetone_ams_db_5esl_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgp_pub_decrypt(bytea, bytea) TO assetone_ams_db_5esl_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgp_pub_decrypt(bytea, bytea, text) TO assetone_ams_db_5esl_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgp_pub_decrypt(bytea, bytea, text, text) TO assetone_ams_db_5esl_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgp_pub_decrypt_bytea(bytea, bytea) TO assetone_ams_db_5esl_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgp_pub_decrypt_bytea(bytea, bytea, text) TO assetone_ams_db_5esl_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO assetone_ams_db_5esl_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgp_pub_encrypt(text, bytea) TO assetone_ams_db_5esl_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgp_pub_encrypt(text, bytea, text) TO assetone_ams_db_5esl_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgp_pub_encrypt_bytea(bytea, bytea) TO assetone_ams_db_5esl_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgp_pub_encrypt_bytea(bytea, bytea, text) TO assetone_ams_db_5esl_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgp_sym_decrypt(bytea, text) TO assetone_ams_db_5esl_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgp_sym_decrypt(bytea, text, text) TO assetone_ams_db_5esl_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgp_sym_decrypt_bytea(bytea, text) TO assetone_ams_db_5esl_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgp_sym_decrypt_bytea(bytea, text, text) TO assetone_ams_db_5esl_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgp_sym_encrypt(text, text) TO assetone_ams_db_5esl_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgp_sym_encrypt(text, text, text) TO assetone_ams_db_5esl_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgp_sym_encrypt_bytea(bytea, text) TO assetone_ams_db_5esl_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgp_sym_encrypt_bytea(bytea, text, text) TO assetone_ams_db_5esl_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON SEQUENCES TO assetone_ams_db_5esl_user;


--
-- Name: DEFAULT PRIVILEGES FOR TYPES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TYPES TO assetone_ams_db_5esl_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON FUNCTIONS TO assetone_ams_db_5esl_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TABLES TO assetone_ams_db_5esl_user;


--
-- PostgreSQL database dump complete
--

\unrestrict PcUNRVFh3gntMBNB0UB61OKMCNZIpgDETeeNHfSW5crxci5c6Txb6Ll1QSHWk7W

