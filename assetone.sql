--
-- PostgreSQL database dump
--

\restrict pMW4miHVzk69qUUG4eHkHWcu4zyCOAWGXRF957yrjrWhSxPHgfPr116QlH4E2yw

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: activity_log; Type: TABLE; Schema: public; Owner: postgres
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
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.activity_log OWNER TO postgres;

--
-- Name: activity_log_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.activity_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.activity_log_id_seq OWNER TO postgres;

--
-- Name: activity_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.activity_log_id_seq OWNED BY public.activity_log.id;


--
-- Name: borrow_logs; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.borrow_logs OWNER TO postgres;

--
-- Name: borrow_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.borrow_logs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.borrow_logs_id_seq OWNER TO postgres;

--
-- Name: borrow_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.borrow_logs_id_seq OWNED BY public.borrow_logs.id;


--
-- Name: departments; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.departments OWNER TO postgres;

--
-- Name: departments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.departments_id_seq
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
-- Name: item_attachments; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.item_attachments OWNER TO postgres;

--
-- Name: item_attachments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.item_attachments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.item_attachments_id_seq OWNER TO postgres;

--
-- Name: item_attachments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.item_attachments_id_seq OWNED BY public.item_attachments.id;


--
-- Name: item_categories; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.item_categories OWNER TO postgres;

--
-- Name: item_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.item_categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.item_categories_id_seq OWNER TO postgres;

--
-- Name: item_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.item_categories_id_seq OWNED BY public.item_categories.id;


--
-- Name: item_costs; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.item_costs OWNER TO postgres;

--
-- Name: item_costs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.item_costs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.item_costs_id_seq OWNER TO postgres;

--
-- Name: item_costs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.item_costs_id_seq OWNED BY public.item_costs.id;


--
-- Name: item_depreciation; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.item_depreciation OWNER TO postgres;

--
-- Name: item_depreciation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.item_depreciation_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.item_depreciation_id_seq OWNER TO postgres;

--
-- Name: item_depreciation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.item_depreciation_id_seq OWNED BY public.item_depreciation.id;


--
-- Name: item_lifecycle; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.item_lifecycle (
    id bigint NOT NULL,
    item_unit_id bigint NOT NULL,
    total_cost numeric(12,2) DEFAULT 0,
    maintenance_cost numeric(12,2) DEFAULT 0,
    repair_cost numeric(12,2) DEFAULT 0,
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.item_lifecycle OWNER TO postgres;

--
-- Name: item_lifecycle_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.item_lifecycle_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.item_lifecycle_id_seq OWNER TO postgres;

--
-- Name: item_lifecycle_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.item_lifecycle_id_seq OWNED BY public.item_lifecycle.id;


--
-- Name: item_requests; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.item_requests OWNER TO postgres;

--
-- Name: item_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.item_requests_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.item_requests_id_seq OWNER TO postgres;

--
-- Name: item_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.item_requests_id_seq OWNED BY public.item_requests.id;


--
-- Name: item_units; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.item_units (
    id bigint NOT NULL,
    item_id bigint NOT NULL,
    serial_number character varying(255),
    unit_tag character varying(50),
    specifications text,
    status character varying(50) DEFAULT 'available'::character varying,
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
    acquisition_date timestamp with time zone
);


ALTER TABLE public.item_units OWNER TO postgres;

--
-- Name: item_units_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.item_units_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.item_units_id_seq OWNER TO postgres;

--
-- Name: item_units_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.item_units_id_seq OWNED BY public.item_units.id;


--
-- Name: items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.items (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    category_id bigint NOT NULL,
    department_id bigint,
    created_by bigint,
    updated_by bigint,
    deleted_by bigint,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    deleted_at timestamp with time zone,
    type character varying(50) DEFAULT 'asset'::character varying,
    is_high_value boolean DEFAULT false
);


ALTER TABLE public.items OWNER TO postgres;

--
-- Name: items_for_distribution; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.items_for_distribution (
    id bigint NOT NULL,
    purchase_request_id bigint,
    item_unit_id bigint,
    received_at timestamp with time zone
);


ALTER TABLE public.items_for_distribution OWNER TO postgres;

--
-- Name: items_for_distribution_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.items_for_distribution_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.items_for_distribution_id_seq OWNER TO postgres;

--
-- Name: items_for_distribution_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.items_for_distribution_id_seq OWNED BY public.items_for_distribution.id;


--
-- Name: items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.items_id_seq OWNER TO postgres;

--
-- Name: items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.items_id_seq OWNED BY public.items.id;


--
-- Name: locations; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.locations OWNER TO postgres;

--
-- Name: locations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.locations_id_seq
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
-- Name: maintenance_history; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.maintenance_history OWNER TO postgres;

--
-- Name: maintenance_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.maintenance_history_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.maintenance_history_id_seq OWNER TO postgres;

--
-- Name: maintenance_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.maintenance_history_id_seq OWNED BY public.maintenance_history.id;


--
-- Name: maintenance_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.maintenance_requests (
    id bigint NOT NULL,
    item_unit_id bigint NOT NULL,
    impact integer DEFAULT 1,
    urgency integer DEFAULT 1,
    status character varying(50) DEFAULT 'pending'::character varying,
    description text NOT NULL,
    requested_by character varying(255) NOT NULL,
    requested_at timestamp with time zone DEFAULT now(),
    reviewed_by bigint,
    reviewed_at timestamp with time zone
);


ALTER TABLE public.maintenance_requests OWNER TO postgres;

--
-- Name: maintenance_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.maintenance_requests_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.maintenance_requests_id_seq OWNER TO postgres;

--
-- Name: maintenance_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.maintenance_requests_id_seq OWNED BY public.maintenance_requests.id;


--
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.password_reset_tokens (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    token_hash character varying(128) NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    used boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.password_reset_tokens OWNER TO postgres;

--
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.password_reset_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.password_reset_tokens_id_seq OWNER TO postgres;

--
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.password_reset_tokens_id_seq OWNED BY public.password_reset_tokens.id;


--
-- Name: pending_registration; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pending_registration (
    id integer NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(50) NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pending_registration_role_check CHECK (((role)::text = ANY ((ARRAY['asset_administrator'::character varying, 'property_custodian'::character varying])::text[]))),
    CONSTRAINT pending_registration_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying])::text[])))
);


ALTER TABLE public.pending_registration OWNER TO postgres;

--
-- Name: pending_registration_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pending_registration_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pending_registration_id_seq OWNER TO postgres;

--
-- Name: pending_registration_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pending_registration_id_seq OWNED BY public.pending_registration.id;


--
-- Name: pr_sequences; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pr_sequences (
    date_key character(8) NOT NULL,
    seq integer NOT NULL
);


ALTER TABLE public.pr_sequences OWNER TO postgres;

--
-- Name: procurement_attachments; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.procurement_attachments OWNER TO postgres;

--
-- Name: procurement_attachments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.procurement_attachments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.procurement_attachments_id_seq OWNER TO postgres;

--
-- Name: procurement_attachments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.procurement_attachments_id_seq OWNED BY public.procurement_attachments.id;


--
-- Name: procurement_finalizations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.procurement_finalizations (
    id bigint NOT NULL,
    purchase_order_id bigint NOT NULL,
    finalized_at timestamp with time zone DEFAULT now(),
    remarks text
);


ALTER TABLE public.procurement_finalizations OWNER TO postgres;

--
-- Name: procurement_finalizations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.procurement_finalizations_id_seq
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
-- Name: purchase_order_items; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.purchase_order_items OWNER TO postgres;

--
-- Name: purchase_order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.purchase_order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.purchase_order_items_id_seq OWNER TO postgres;

--
-- Name: purchase_order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.purchase_order_items_id_seq OWNED BY public.purchase_order_items.id;


--
-- Name: purchase_orders; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.purchase_orders OWNER TO postgres;

--
-- Name: purchase_orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.purchase_orders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.purchase_orders_id_seq OWNER TO postgres;

--
-- Name: purchase_orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.purchase_orders_id_seq OWNED BY public.purchase_orders.id;


--
-- Name: purchase_requests; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.purchase_requests OWNER TO postgres;

--
-- Name: purchase_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.purchase_requests_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.purchase_requests_id_seq OWNER TO postgres;

--
-- Name: purchase_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.purchase_requests_id_seq OWNED BY public.purchase_requests.id;


--
-- Name: relocation_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.relocation_log (
    id integer NOT NULL,
    item_unit_id integer NOT NULL,
    from_sub_location_id integer,
    to_sub_location_id integer,
    requested_by integer NOT NULL,
    completed_by integer,
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    requested_at timestamp without time zone DEFAULT now() NOT NULL,
    completed_at timestamp without time zone,
    requested_from bigint
);


ALTER TABLE public.relocation_log OWNER TO postgres;

--
-- Name: relocation_log_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.relocation_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.relocation_log_id_seq OWNER TO postgres;

--
-- Name: relocation_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.relocation_log_id_seq OWNED BY public.relocation_log.id;


--
-- Name: requested_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.requested_items (
    id bigint NOT NULL,
    purchase_request_id bigint NOT NULL,
    item_description text NOT NULL,
    quantity integer DEFAULT 1
);


ALTER TABLE public.requested_items OWNER TO postgres;

--
-- Name: requested_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.requested_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.requested_items_id_seq OWNER TO postgres;

--
-- Name: requested_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.requested_items_id_seq OWNED BY public.requested_items.id;


--
-- Name: schedule_occurrences; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.schedule_occurrences OWNER TO postgres;

--
-- Name: schedule_occurrences_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.schedule_occurrences_id_seq
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
    id bigint NOT NULL,
    occurrence_id bigint NOT NULL,
    user_id bigint NOT NULL,
    assigned_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.schedule_technicians OWNER TO postgres;

--
-- Name: schedule_technicians_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.schedule_technicians_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.schedule_technicians_id_seq OWNER TO postgres;

--
-- Name: schedule_technicians_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.schedule_technicians_id_seq OWNED BY public.schedule_technicians.id;


--
-- Name: schedule_templates; Type: TABLE; Schema: public; Owner: postgres
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
    item_id integer NOT NULL
);


ALTER TABLE public.schedule_templates OWNER TO postgres;

--
-- Name: schedule_templates_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.schedule_templates_id_seq
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
-- Name: schedule_units; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.schedule_units (
    id bigint NOT NULL,
    occurrence_id bigint NOT NULL,
    item_unit_id bigint NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying
);


ALTER TABLE public.schedule_units OWNER TO postgres;

--
-- Name: schedule_units_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.schedule_units_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.schedule_units_id_seq OWNER TO postgres;

--
-- Name: schedule_units_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.schedule_units_id_seq OWNED BY public.schedule_units.id;


--
-- Name: sub_locations; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.sub_locations OWNER TO postgres;

--
-- Name: sub_locations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sub_locations_id_seq
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
    deleted_at timestamp with time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
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
-- Name: vendor_offers; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.vendor_offers OWNER TO postgres;

--
-- Name: vendor_offers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vendor_offers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vendor_offers_id_seq OWNER TO postgres;

--
-- Name: vendor_offers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vendor_offers_id_seq OWNED BY public.vendor_offers.id;


--
-- Name: vendors; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.vendors OWNER TO postgres;

--
-- Name: vendors_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vendors_id_seq
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
-- Name: activity_log id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_log ALTER COLUMN id SET DEFAULT nextval('public.activity_log_id_seq'::regclass);


--
-- Name: borrow_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.borrow_logs ALTER COLUMN id SET DEFAULT nextval('public.borrow_logs_id_seq'::regclass);


--
-- Name: departments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments ALTER COLUMN id SET DEFAULT nextval('public.departments_id_seq'::regclass);


--
-- Name: item_attachments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_attachments ALTER COLUMN id SET DEFAULT nextval('public.item_attachments_id_seq'::regclass);


--
-- Name: item_categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_categories ALTER COLUMN id SET DEFAULT nextval('public.item_categories_id_seq'::regclass);


--
-- Name: item_costs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_costs ALTER COLUMN id SET DEFAULT nextval('public.item_costs_id_seq'::regclass);


--
-- Name: item_depreciation id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_depreciation ALTER COLUMN id SET DEFAULT nextval('public.item_depreciation_id_seq'::regclass);


--
-- Name: item_lifecycle id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_lifecycle ALTER COLUMN id SET DEFAULT nextval('public.item_lifecycle_id_seq'::regclass);


--
-- Name: item_requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_requests ALTER COLUMN id SET DEFAULT nextval('public.item_requests_id_seq'::regclass);


--
-- Name: item_units id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_units ALTER COLUMN id SET DEFAULT nextval('public.item_units_id_seq'::regclass);


--
-- Name: items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items ALTER COLUMN id SET DEFAULT nextval('public.items_id_seq'::regclass);


--
-- Name: items_for_distribution id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items_for_distribution ALTER COLUMN id SET DEFAULT nextval('public.items_for_distribution_id_seq'::regclass);


--
-- Name: locations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations ALTER COLUMN id SET DEFAULT nextval('public.locations_id_seq'::regclass);


--
-- Name: maintenance_history id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_history ALTER COLUMN id SET DEFAULT nextval('public.maintenance_history_id_seq'::regclass);


--
-- Name: maintenance_requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_requests ALTER COLUMN id SET DEFAULT nextval('public.maintenance_requests_id_seq'::regclass);


--
-- Name: password_reset_tokens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_tokens ALTER COLUMN id SET DEFAULT nextval('public.password_reset_tokens_id_seq'::regclass);


--
-- Name: pending_registration id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pending_registration ALTER COLUMN id SET DEFAULT nextval('public.pending_registration_id_seq'::regclass);


--
-- Name: procurement_attachments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procurement_attachments ALTER COLUMN id SET DEFAULT nextval('public.procurement_attachments_id_seq'::regclass);


--
-- Name: procurement_finalizations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procurement_finalizations ALTER COLUMN id SET DEFAULT nextval('public.procurement_finalizations_id_seq'::regclass);


--
-- Name: purchase_order_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order_items ALTER COLUMN id SET DEFAULT nextval('public.purchase_order_items_id_seq'::regclass);


--
-- Name: purchase_orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_orders ALTER COLUMN id SET DEFAULT nextval('public.purchase_orders_id_seq'::regclass);


--
-- Name: purchase_requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_requests ALTER COLUMN id SET DEFAULT nextval('public.purchase_requests_id_seq'::regclass);


--
-- Name: relocation_log id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relocation_log ALTER COLUMN id SET DEFAULT nextval('public.relocation_log_id_seq'::regclass);


--
-- Name: requested_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requested_items ALTER COLUMN id SET DEFAULT nextval('public.requested_items_id_seq'::regclass);


--
-- Name: schedule_occurrences id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedule_occurrences ALTER COLUMN id SET DEFAULT nextval('public.schedule_occurrences_id_seq'::regclass);


--
-- Name: schedule_technicians id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedule_technicians ALTER COLUMN id SET DEFAULT nextval('public.schedule_technicians_id_seq'::regclass);


--
-- Name: schedule_templates id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedule_templates ALTER COLUMN id SET DEFAULT nextval('public.schedule_templates_id_seq'::regclass);


--
-- Name: schedule_units id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedule_units ALTER COLUMN id SET DEFAULT nextval('public.schedule_units_id_seq'::regclass);


--
-- Name: sub_locations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sub_locations ALTER COLUMN id SET DEFAULT nextval('public.sub_locations_id_seq'::regclass);


--
-- Name: vendor_offers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor_offers ALTER COLUMN id SET DEFAULT nextval('public.vendor_offers_id_seq'::regclass);


--
-- Name: vendors id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendors ALTER COLUMN id SET DEFAULT nextval('public.vendors_id_seq'::regclass);


--
-- Data for Name: activity_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.activity_log (id, user_id, module, action, endpoint, method, request_body, ip_address, user_agent, created_at) FROM stdin;
1	1	users	UPDATE	/api/users/1	PATCH	{"status": "inactive"}	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 Edg/141.0.0.0	2025-10-26 21:05:24.201616+08
2	1	users	UPDATE	/api/users/1	PATCH	{"status": "active"}	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 Edg/141.0.0.0	2025-10-26 21:05:50.761398+08
3	1	users	VIEW	/api/users/me	GET	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 Edg/141.0.0.0	2025-10-26 21:05:50.915975+08
4	1	users	UPDATE	/api/users/1	PATCH	{"status": "inactive"}	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 Edg/141.0.0.0	2025-10-26 21:06:34.03437+08
5	\N	auth	CREATE	/api/auth/login	POST	{"email": "cruzrowellt11@gmail.com", "password": "password123"}	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 Edg/141.0.0.0	2025-10-26 21:06:34.763901+08
6	1	users	UPDATE	/api/users/1	PATCH	{"status": "active"}	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 Edg/141.0.0.0	2025-10-26 21:06:34.893167+08
7	1	users	VIEW	/api/users/me	GET	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 Edg/141.0.0.0	2025-10-26 21:06:34.902973+08
8	1	users	VIEW	/api/users/me	GET	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 Edg/141.0.0.0	2025-10-26 21:09:16.03299+08
9	1	users	VIEW	/api/users/me	GET	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 Edg/141.0.0.0	2025-10-26 21:09:16.047529+08
\.


--
-- Data for Name: borrow_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.borrow_logs (id, item_unit_id, borrowed_by, lend_by, borrowed_at, returned_at, status, remarks, purpose, due_date) FROM stdin;
\.


--
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.departments (id, name, created_by, updated_by, deleted_by, created_at, updated_at, deleted_at, code) FROM stdin;
3	Information Technology	5	5	\N	2025-11-05 04:27:58.985455+08	2025-11-05 04:27:58.985455+08	\N	IT
4	General Services Office	5	5	\N	2025-11-05 04:27:58.985455+08	2025-11-05 04:27:58.985455+08	\N	GSO
5	Finance	5	5	\N	2025-11-05 04:27:58.985455+08	2025-11-05 04:27:58.985455+08	\N	FIN
6	Marketing	5	5	\N	2025-11-05 04:27:58.985455+08	2025-11-05 04:27:58.985455+08	\N	MKT
7	Operations	5	5	\N	2025-11-05 04:27:58.985455+08	2025-11-05 04:27:58.985455+08	\N	OPS
8	Customer Service	5	5	\N	2025-11-05 04:27:58.985455+08	2025-11-05 04:27:58.985455+08	\N	CS
9	Research and Development	5	5	\N	2025-11-05 04:27:58.985455+08	2025-11-05 04:27:58.985455+08	\N	RND
10	Music	5	5	\N	2025-11-05 04:27:58.985455+08	2025-11-05 04:27:58.985455+08	\N	MSC
11	Quality Assurance	5	5	\N	2025-11-05 04:27:58.985455+08	2025-11-05 04:27:58.985455+08	\N	QA
12	Legal	5	5	\N	2025-11-05 04:27:58.985455+08	2025-11-05 04:27:58.985455+08	\N	LEGAL
\.


--
-- Data for Name: item_attachments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.item_attachments (id, item_id, file_name, file_path, mime_type, context, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: item_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.item_categories (id, name, code, created_by, updated_by, deleted_by, created_at, updated_at, deleted_at) FROM stdin;
4	Office Supplies	OFFS	5	\N	\N	2025-11-05 04:52:48.26315+08	2025-11-05 04:52:48.26315+08	\N
5	Computer Equipment	COMPQ	5	\N	\N	2025-11-05 04:52:48.26315+08	2025-11-05 04:52:48.26315+08	\N
6	Networking Devices	NETDV	5	\N	\N	2025-11-05 04:52:48.26315+08	2025-11-05 04:52:48.26315+08	\N
8	Furniture	FURNI	5	\N	\N	2025-11-05 04:52:48.26315+08	2025-11-05 04:52:48.26315+08	\N
9	Laboratory Equipment	LABEQ	5	\N	\N	2025-11-05 04:52:48.26315+08	2025-11-05 04:52:48.26315+08	\N
10	Audio Visual Equipment	AUDIO	5	\N	\N	2025-11-05 04:52:48.26315+08	2025-11-05 04:52:48.26315+08	\N
11	Maintenance Tools	TOOLM	5	\N	\N	2025-11-05 04:52:48.26315+08	2025-11-05 04:52:48.26315+08	\N
12	Software Licenses	SOFTL	5	\N	\N	2025-11-05 04:52:48.26315+08	2025-11-05 04:52:48.26315+08	\N
13	Cleaning Supplies	CLNSP	5	\N	\N	2025-11-05 04:52:48.26315+08	2025-11-05 04:52:48.26315+08	\N
7	Electrical Supplies	ELECS	5	5	\N	2025-11-05 04:52:48.26315+08	2025-11-05 04:53:14.028+08	\N
\.


--
-- Data for Name: item_costs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.item_costs (id, item_unit_id, purchase_price, additional_cost, total_cost, created_at, updated_at) FROM stdin;
292	297	25000.00	\N	\N	2025-11-05 04:58:52.231525+08	2025-11-05 04:58:52.231525+08
293	298	2001.00	\N	\N	2025-11-05 05:14:26.394977+08	2025-11-05 05:14:26.394977+08
294	299	2001.00	\N	\N	2025-11-05 05:14:26.405403+08	2025-11-05 05:14:26.405403+08
295	300	2001.00	\N	\N	2025-11-05 05:14:26.410698+08	2025-11-05 05:14:26.410698+08
296	301	2001.00	\N	\N	2025-11-05 05:14:26.415881+08	2025-11-05 05:14:26.415881+08
297	302	2001.00	\N	\N	2025-11-05 05:14:26.422364+08	2025-11-05 05:14:26.422364+08
298	303	20000.00	\N	\N	2025-11-06 20:00:05.853873+08	2025-11-06 20:00:05.853873+08
299	304	20000.00	\N	\N	2025-11-06 20:00:05.879929+08	2025-11-06 20:00:05.879929+08
300	305	20000.00	\N	\N	2025-11-06 20:00:05.897845+08	2025-11-06 20:00:05.897845+08
301	306	20000.00	\N	\N	2025-11-06 20:00:05.932367+08	2025-11-06 20:00:05.932367+08
302	307	20000.00	\N	\N	2025-11-06 20:00:05.954457+08	2025-11-06 20:00:05.954457+08
\.


--
-- Data for Name: item_depreciation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.item_depreciation (id, item_unit_id, method, purchase_date, rate, useful_life, accumulated_depreciation, updated_by, updated_at) FROM stdin;
295	297	straight_line	2024-10-09	0.20	5	0.00	\N	2025-11-05 04:58:52.219857+08
296	298	\N	\N	\N	\N	0.00	\N	2025-11-05 05:14:26.392321+08
297	299	\N	\N	\N	\N	0.00	\N	2025-11-05 05:14:26.404364+08
298	300	\N	\N	\N	\N	0.00	\N	2025-11-05 05:14:26.409812+08
299	301	\N	\N	\N	\N	0.00	\N	2025-11-05 05:14:26.414988+08
300	302	\N	\N	\N	\N	0.00	\N	2025-11-05 05:14:26.421467+08
301	303	straight_line	2025-10-30	0.20	5	0.00	\N	2025-11-06 20:00:05.817764+08
302	304	straight_line	2025-10-30	0.20	5	0.00	\N	2025-11-06 20:00:05.870313+08
303	305	straight_line	2025-10-30	0.20	5	0.00	\N	2025-11-06 20:00:05.896925+08
304	306	straight_line	2025-10-30	0.20	5	0.00	\N	2025-11-06 20:00:05.931412+08
305	307	straight_line	2025-10-30	0.20	5	0.00	\N	2025-11-06 20:00:05.953508+08
\.


--
-- Data for Name: item_lifecycle; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.item_lifecycle (id, item_unit_id, total_cost, maintenance_cost, repair_cost, updated_at) FROM stdin;
\.


--
-- Data for Name: item_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.item_requests (id, item_id, quantity, reason, remarks, status, date_required, requested_by, requested_at, reviewed_by, reviewed_at) FROM stdin;
\.


--
-- Data for Name: item_units; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.item_units (id, item_id, serial_number, unit_tag, specifications, status, sub_location_id, is_legacy, owner_department_id, created_by, updated_by, deleted_by, created_at, updated_at, deleted_at, vendor_id, brand, condition, acquisition_date) FROM stdin;
302	22	MNO-456	IT-COMPQ-0006	\N	available	\N	f	3	2	2	\N	2025-11-05 05:14:26.42023+08	2025-11-05 05:14:26.42023+08	\N	11	HP	100	2025-11-05 05:14:26.417+08
303	22	\N	IT-COMPQ-0007	\N	available	21	t	3	5	5	\N	2025-11-06 20:00:05.78821+08	2025-11-06 20:00:05.78821+08	\N	\N	HEHE-006	100	\N
304	22	\N	IT-COMPQ-0008	\N	available	21	t	3	5	5	\N	2025-11-06 20:00:05.869242+08	2025-11-06 20:00:05.869242+08	\N	\N	HEHE-006	100	\N
305	22	\N	IT-COMPQ-0009	\N	available	21	t	3	5	5	\N	2025-11-06 20:00:05.89539+08	2025-11-06 20:00:05.89539+08	\N	\N	HEHE-006	100	\N
307	22	\N	IT-COMPQ-0011	\N	available	21	t	3	5	5	\N	2025-11-06 20:00:05.943947+08	2025-11-06 20:00:05.943947+08	\N	\N	HEHE-006	100	\N
297	22	DLL-599	IT-COMPQ-0001	\N	available	30	t	9	5	5	\N	2025-11-05 04:58:52.216757+08	2025-11-05 04:58:52.216757+08	\N	\N	Dell	100	\N
298	22	ABC-123	IT-COMPQ-0002	\N	available	\N	f	9	2	2	\N	2025-11-05 05:14:26.39024+08	2025-11-05 05:14:26.39024+08	\N	11	HP	100	2025-11-05 05:14:26.387+08
300	22	GHI-789	IT-COMPQ-0004	\N	available	21	f	9	2	1	\N	2025-11-05 05:14:26.408589+08	2025-11-05 05:14:26.408589+08	\N	11	HP	100	2025-11-05 05:14:26.406+08
301	22	JKL-123	IT-COMPQ-0005	\N	available	\N	f	9	2	1	\N	2025-11-05 05:14:26.413935+08	2025-11-05 05:14:26.413935+08	\N	11	HP	100	2025-11-05 05:14:26.411+08
299	22	DEF-456	IT-COMPQ-0003	\N	available	\N	f	9	2	1	\N	2025-11-05 05:14:26.403298+08	2025-11-05 05:14:26.403298+08	\N	11	HP	100	2025-11-05 05:14:26.4+08
306	22	\N	IT-COMPQ-0010	\N	available	21	t	3	5	5	\N	2025-11-06 20:00:05.911652+08	2025-11-06 20:00:05.911652+08	\N	\N	HEHE-006	100	\N
\.


--
-- Data for Name: items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.items (id, name, category_id, department_id, created_by, updated_by, deleted_by, created_at, updated_at, deleted_at, type, is_high_value) FROM stdin;
22	Laptop	5	3	5	5	\N	2025-11-05 04:57:33.942804+08	2025-11-05 04:57:44.556+08	\N	asset	f
\.


--
-- Data for Name: items_for_distribution; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.items_for_distribution (id, purchase_request_id, item_unit_id, received_at) FROM stdin;
108	20	298	\N
109	20	299	\N
110	20	300	\N
111	20	301	\N
112	20	302	\N
\.


--
-- Data for Name: locations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.locations (id, name, created_by, updated_by, deleted_by, created_at, updated_at, deleted_at) FROM stdin;
4	Annex Building	\N	\N	\N	2025-11-05 04:29:59.036817+08	2025-11-05 04:29:59.036817+08	\N
5	Laboratory Complex	\N	\N	\N	2025-11-05 04:29:59.036817+08	2025-11-05 04:29:59.036817+08	\N
3	Main Campus	\N	5	\N	2025-11-05 04:29:59.036817+08	2025-11-05 04:34:37.467+08	\N
7	Sports Complex	\N	5	\N	2025-11-05 04:29:59.036817+08	2025-11-05 04:54:37.86+08	\N
6	Library & Resource Center	\N	5	\N	2025-11-05 04:29:59.036817+08	2025-11-05 04:54:43.492+08	\N
\.


--
-- Data for Name: maintenance_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.maintenance_history (id, item_unit_id, occurrence_id, performed_by, maintenance_type, description, performed_at) FROM stdin;
\.


--
-- Data for Name: maintenance_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.maintenance_requests (id, item_unit_id, impact, urgency, status, description, requested_by, requested_at, reviewed_by, reviewed_at) FROM stdin;
\.


--
-- Data for Name: password_reset_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.password_reset_tokens (id, user_id, token_hash, expires_at, used, created_at) FROM stdin;
\.


--
-- Data for Name: pending_registration; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pending_registration (id, first_name, last_name, email, password, role, status, created_at, updated_at) FROM stdin;
2	Rowell	Cruz	zaravoc5@gmail.com	$2b$10$ll1NQwiHCjRghUbXVzkCPuGtKo6mNm48hMvaVeBKZaXJrMs/0qYxe	asset_administrator	approved	2025-11-09 10:42:23.552342	2025-11-09 11:44:46.685522
1	Rowell	Cruz	cruz.rowell00510@gmail.com	$2b$10$OC9VpPZj.bHOM7I8.l4Il.ZxHtGngsAQNPK4wXKlbnMy/A9zVKPg6	property_custodian	approved	2025-11-09 10:25:22.407271	2025-11-09 11:46:35.736508
\.


--
-- Data for Name: pr_sequences; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pr_sequences (date_key, seq) FROM stdin;
20251104	1
\.


--
-- Data for Name: procurement_attachments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.procurement_attachments (id, purchase_request_id, file_name, file_path, uploaded_at, updated_at, mime_type, uploaded_by, module) FROM stdin;
40	20	purchase-requisition-20.pdf	1762290765556-971311466.pdf	2025-11-05 05:12:45.562979+08	2025-11-05 05:12:45.562979+08	application/pdf	2	approved_prf
41	20	stickers.pdf	1762290813965-132211168.pdf	2025-11-05 05:13:34.020998+08	2025-11-05 05:13:34.020998+08	application/pdf	2	approved_pof
\.


--
-- Data for Name: procurement_finalizations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.procurement_finalizations (id, purchase_order_id, finalized_at, remarks) FROM stdin;
\.


--
-- Data for Name: purchase_order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchase_order_items (id, purchase_order_id, item_name, quantity, unit_price, specifications, created_at, updated_at, brand, acquired_date, useful_life) FROM stdin;
11	30	Laptop	5	2001.00	RAM:32 GB	2025-11-05 05:13:36.501142	2025-11-05 05:13:36.501142	HP	2025-11-05 05:14:26.314+08	\N
\.


--
-- Data for Name: purchase_orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchase_orders (id, po_number, vendor_id, created_at, updated_at, purchase_request_id, status, delivered_at) FROM stdin;
30	\N	11	2025-11-05 05:13:36.498598+08	2025-11-05 05:14:28.539+08	20	delivered	2025-11-05 05:14:28.539+08
\.


--
-- Data for Name: purchase_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchase_requests (id, control_number, date_required, requested_by, requested_at, status, item_category_id, reason, remarks, reviewed_by, reviewed_at, updated_at, updated_by, planned_cost) FROM stdin;
20	PR-20251104-0001	2025-11-27 05:11:00+08	2	2025-11-05 05:12:03.508+08	for_distribution	5	For stock	\N	\N	\N	2025-11-05 05:14:28.477+08	2	5000.00
\.


--
-- Data for Name: relocation_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.relocation_log (id, item_unit_id, from_sub_location_id, to_sub_location_id, requested_by, completed_by, status, requested_at, completed_at, requested_from) FROM stdin;
1	299	\N	24	1	\N	pending	2025-11-05 17:31:50.061192	\N	\N
\.


--
-- Data for Name: requested_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.requested_items (id, purchase_request_id, item_description, quantity) FROM stdin;
20	20	Laptop	5
\.


--
-- Data for Name: schedule_occurrences; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.schedule_occurrences (id, template_id, scheduled_date, status, review_remarks, skipped_reason, created_by, updated_by, started_by, completed_by, skipped_by, reviewed_by, created_at, updated_at, started_at, completed_at, skipped_at, reviewed_at) FROM stdin;
21	19	2025-11-06 17:00:00+08	pending	\N	\N	\N	\N	\N	\N	\N	\N	2025-11-05 05:07:47.684239+08	2025-11-05 05:07:47.684239+08	\N	\N	\N	\N
22	20	2025-11-02 05:10:00+08	skipped	\N	hehe	\N	\N	\N	\N	5	\N	2025-11-05 05:10:52.788653+08	2025-11-05 05:10:52.788653+08	\N	\N	2025-11-05 21:18:31.548+08	\N
23	20	2025-11-30 05:10:00+08	pending	\N	\N	\N	\N	\N	\N	\N	\N	2025-11-05 21:18:31.594263+08	2025-11-05 21:18:31.594263+08	\N	\N	\N	\N
\.


--
-- Data for Name: schedule_technicians; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.schedule_technicians (id, occurrence_id, user_id, assigned_at) FROM stdin;
\.


--
-- Data for Name: schedule_templates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.schedule_templates (id, type, title, description, frequency_value, frequency_unit, grace_period_value, grace_period_unit, status, start_date, end_date, created_by, updated_by, stopped_by, created_at, updated_at, stopped_at, item_id) FROM stdin;
19	PM	Weekly inspection	Perform weekly inspection of laptops to check hardware functionality, software updates, battery health, cleanliness, and proper configuration. Document any issues and report for maintenance if necessary.	4	days	5	hours	active	2025-11-06 17:00:00+08	2026-01-05 05:07:00+08	5	5	\N	2025-11-05 05:07:47.680447+08	2025-11-05 05:07:47.308+08	\N	22
20	PM	System Performance Review	Check operating system updates, software performance, and storage health. Clean temporary files and optimize system settings for smooth operation	4	weeks	1	days	active	2025-11-02 05:10:00+08	2025-12-31 05:10:00+08	5	5	\N	2025-11-05 05:10:52.736692+08	2025-11-05 05:10:52.356+08	\N	22
\.


--
-- Data for Name: schedule_units; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.schedule_units (id, occurrence_id, item_unit_id, status) FROM stdin;
\.


--
-- Data for Name: sub_locations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sub_locations (id, location_id, name, created_by, updated_by, deleted_by, created_at, updated_at, deleted_at) FROM stdin;
6	1	Building A	\N	\N	\N	2025-11-05 04:29:59.13958+08	2025-11-05 04:29:59.13958+08	\N
7	1	Building B	\N	\N	\N	2025-11-05 04:29:59.13958+08	2025-11-05 04:29:59.13958+08	\N
8	1	Building C	\N	\N	\N	2025-11-05 04:29:59.13958+08	2025-11-05 04:29:59.13958+08	\N
9	1	Administration Office	\N	\N	\N	2025-11-05 04:29:59.13958+08	2025-11-05 04:29:59.13958+08	\N
10	1	Cafeteria	\N	\N	\N	2025-11-05 04:29:59.13958+08	2025-11-05 04:29:59.13958+08	\N
11	2	Room 101	\N	\N	\N	2025-11-05 04:29:59.232958+08	2025-11-05 04:29:59.232958+08	\N
12	2	Room 102	\N	\N	\N	2025-11-05 04:29:59.232958+08	2025-11-05 04:29:59.232958+08	\N
13	2	Room 103	\N	\N	\N	2025-11-05 04:29:59.232958+08	2025-11-05 04:29:59.232958+08	\N
14	2	Conference Hall	\N	\N	\N	2025-11-05 04:29:59.232958+08	2025-11-05 04:29:59.232958+08	\N
15	2	Staff Lounge	\N	\N	\N	2025-11-05 04:29:59.232958+08	2025-11-05 04:29:59.232958+08	\N
17	3	Chemistry Lab	\N	\N	\N	2025-11-05 04:29:59.269602+08	2025-11-05 04:29:59.269602+08	\N
18	3	Biology Lab	\N	\N	\N	2025-11-05 04:29:59.269602+08	2025-11-05 04:29:59.269602+08	\N
19	3	Computer Lab	\N	\N	\N	2025-11-05 04:29:59.269602+08	2025-11-05 04:29:59.269602+08	\N
20	3	Robotics Lab	\N	\N	\N	2025-11-05 04:29:59.269602+08	2025-11-05 04:29:59.269602+08	\N
21	4	Reading Area	\N	\N	\N	2025-11-05 04:29:59.308206+08	2025-11-05 04:29:59.308206+08	\N
22	4	Computer Room	\N	\N	\N	2025-11-05 04:29:59.308206+08	2025-11-05 04:29:59.308206+08	\N
23	4	Archives	\N	\N	\N	2025-11-05 04:29:59.308206+08	2025-11-05 04:29:59.308206+08	\N
24	4	Reference Section	\N	\N	\N	2025-11-05 04:29:59.308206+08	2025-11-05 04:29:59.308206+08	\N
25	4	Audio-Visual Room	\N	\N	\N	2025-11-05 04:29:59.308206+08	2025-11-05 04:29:59.308206+08	\N
26	5	Gymnasium	\N	\N	\N	2025-11-05 04:29:59.348266+08	2025-11-05 04:29:59.348266+08	\N
27	5	Swimming Pool	\N	\N	\N	2025-11-05 04:29:59.348266+08	2025-11-05 04:29:59.348266+08	\N
28	5	Tennis Courts	\N	\N	\N	2025-11-05 04:29:59.348266+08	2025-11-05 04:29:59.348266+08	\N
29	5	Football Field	\N	\N	\N	2025-11-05 04:29:59.348266+08	2025-11-05 04:29:59.348266+08	\N
30	5	Locker Rooms	\N	\N	\N	2025-11-05 04:29:59.348266+08	2025-11-05 04:29:59.348266+08	\N
16	3	Physics Lab	\N	5	\N	2025-11-05 04:29:59.269602+08	2025-11-05 04:30:10.555+08	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, first_name, last_name, email, password, role, department_id, status, created_by, updated_by, disabled_by, deleted_by, created_at, updated_at, disabled_at, deleted_at) FROM stdin;
1	Rowell	Cruz	cruzrowellt11@gmail.com	$2b$10$75WdYiTrGU1P2TwiIU6VJeqlM5PWeA3X64SdEJwMsfuvdA5s197rq	system_administrator	\N	active	\N	1	1	\N	2025-10-16 18:13:18.932041+08	2025-10-16 11:03:52.015+08	2025-10-16 11:03:52.015+08	\N
22	Rowell	Cruz	zaravoc5@gmail.com	$2b$10$ll1NQwiHCjRghUbXVzkCPuGtKo6mNm48hMvaVeBKZaXJrMs/0qYxe	asset_administrator	\N	inactive	\N	\N	\N	\N	2025-11-09 11:44:46.683848+08	2025-11-09 11:44:46.683848+08	\N	\N
23	Rowell	Cruz	cruz.rowell00510@gmail.com	$2b$10$OC9VpPZj.bHOM7I8.l4Il.ZxHtGngsAQNPK4wXKlbnMy/A9zVKPg6	property_custodian	\N	inactive	\N	\N	\N	\N	2025-11-09 11:46:35.652064+08	2025-11-09 11:46:35.652064+08	\N	\N
\.


--
-- Data for Name: vendor_offers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vendor_offers (id, vendor_id, item_category_id, item_id, offer_details, price, valid_until, created_at, updated_at) FROM stdin;
36	16	8	\N	\N	\N	\N	2025-11-05 05:04:01.939605+08	2025-11-05 05:04:01.939605+08
37	16	9	\N	\N	\N	\N	2025-11-05 05:04:01.939605+08	2025-11-05 05:04:01.939605+08
40	12	4	\N	\N	\N	\N	2025-11-05 05:05:09.771769+08	2025-11-05 05:05:09.771769+08
41	12	5	\N	\N	\N	\N	2025-11-05 05:05:09.771769+08	2025-11-05 05:05:09.771769+08
42	12	4	\N	\N	\N	\N	2025-11-05 05:05:09.772078+08	2025-11-05 05:05:09.772078+08
43	12	5	\N	\N	\N	\N	2025-11-05 05:05:09.772078+08	2025-11-05 05:05:09.772078+08
\.


--
-- Data for Name: vendors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vendors (id, name, contact_person, contact_email, contact_phone, address, created_by, updated_by, deleted_by, created_at, updated_at, deleted_at) FROM stdin;
11	Tech Solutions Inc.	Alice Reyes	alice.reyes@techsolutions.com	0917-123-4567	123 Innovation St., Makati City	5	\N	\N	2025-11-05 05:03:48.314532+08	2025-11-05 05:03:48.314532+08	\N
13	Lab Equipment Supply	Rina Cruz	rina.cruz@labequip.com	0933-555-7890	12 Science Blvd., Taguig City	5	\N	\N	2025-11-05 05:03:48.314532+08	2025-11-05 05:03:48.314532+08	\N
14	Clean & Safe Products	John Lim	john.lim@cleansafe.com	0944-321-0987	88 Hygiene Rd., Mandaluyong City	5	\N	\N	2025-11-05 05:03:48.314532+08	2025-11-05 05:03:48.314532+08	\N
15	Furniture World	Maria Torres	maria.torres@furnitureworld.com	0955-654-3210	77 Home Lane, Pasig City	5	\N	\N	2025-11-05 05:03:48.314532+08	2025-11-05 05:03:48.314532+08	\N
16	Vendor A	Neil Raphael Ramos	vendor.a@email.com	asd	321 Secure Lane, Safety Town, FL 33101	5	5	5	2025-11-05 05:04:01.93655+08	2025-11-05 05:04:09.34+08	2025-11-05 05:04:09.34+08
12	Office Essentials Co.	Mark Santos	mark.santos@officeessentials.com	0922-987-6543	45 Business Ave., Quezon City	5	5	\N	2025-11-05 05:03:48.314532+08	2025-11-05 05:05:09.765+08	\N
\.


--
-- Name: activity_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.activity_log_id_seq', 9, true);


--
-- Name: borrow_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.borrow_logs_id_seq', 24, true);


--
-- Name: departments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.departments_id_seq', 12, true);


--
-- Name: item_attachments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.item_attachments_id_seq', 1, false);


--
-- Name: item_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.item_categories_id_seq', 13, true);


--
-- Name: item_costs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.item_costs_id_seq', 302, true);


--
-- Name: item_depreciation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.item_depreciation_id_seq', 305, true);


--
-- Name: item_lifecycle_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.item_lifecycle_id_seq', 1, false);


--
-- Name: item_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.item_requests_id_seq', 1, false);


--
-- Name: item_units_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.item_units_id_seq', 307, true);


--
-- Name: items_for_distribution_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.items_for_distribution_id_seq', 112, true);


--
-- Name: items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.items_id_seq', 22, true);


--
-- Name: locations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.locations_id_seq', 7, true);


--
-- Name: maintenance_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.maintenance_history_id_seq', 1, false);


--
-- Name: maintenance_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.maintenance_requests_id_seq', 1, true);


--
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.password_reset_tokens_id_seq', 4, true);


--
-- Name: pending_registration_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pending_registration_id_seq', 2, true);


--
-- Name: procurement_attachments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.procurement_attachments_id_seq', 41, true);


--
-- Name: procurement_finalizations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.procurement_finalizations_id_seq', 1, false);


--
-- Name: purchase_order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.purchase_order_items_id_seq', 11, true);


--
-- Name: purchase_orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.purchase_orders_id_seq', 30, true);


--
-- Name: purchase_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.purchase_requests_id_seq', 20, true);


--
-- Name: relocation_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.relocation_log_id_seq', 1, true);


--
-- Name: requested_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.requested_items_id_seq', 20, true);


--
-- Name: schedule_occurrences_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.schedule_occurrences_id_seq', 23, true);


--
-- Name: schedule_technicians_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.schedule_technicians_id_seq', 1, true);


--
-- Name: schedule_templates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.schedule_templates_id_seq', 20, true);


--
-- Name: schedule_units_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.schedule_units_id_seq', 2, true);


--
-- Name: sub_locations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sub_locations_id_seq', 30, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 23, true);


--
-- Name: vendor_offers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vendor_offers_id_seq', 43, true);


--
-- Name: vendors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vendors_id_seq', 16, true);


--
-- Name: activity_log activity_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_log
    ADD CONSTRAINT activity_log_pkey PRIMARY KEY (id);


--
-- Name: borrow_logs borrow_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.borrow_logs
    ADD CONSTRAINT borrow_logs_pkey PRIMARY KEY (id);


--
-- Name: departments departments_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_code_key UNIQUE (code);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- Name: item_attachments item_attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_attachments
    ADD CONSTRAINT item_attachments_pkey PRIMARY KEY (id);


--
-- Name: item_categories item_categories_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_categories
    ADD CONSTRAINT item_categories_code_key UNIQUE (code);


--
-- Name: item_categories item_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_categories
    ADD CONSTRAINT item_categories_pkey PRIMARY KEY (id);


--
-- Name: item_costs item_costs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_costs
    ADD CONSTRAINT item_costs_pkey PRIMARY KEY (id);


--
-- Name: item_depreciation item_depreciation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_depreciation
    ADD CONSTRAINT item_depreciation_pkey PRIMARY KEY (id);


--
-- Name: item_lifecycle item_lifecycle_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_lifecycle
    ADD CONSTRAINT item_lifecycle_pkey PRIMARY KEY (id);


--
-- Name: item_requests item_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_requests
    ADD CONSTRAINT item_requests_pkey PRIMARY KEY (id);


--
-- Name: item_units item_units_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_units
    ADD CONSTRAINT item_units_pkey PRIMARY KEY (id);


--
-- Name: items_for_distribution items_for_distribution_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items_for_distribution
    ADD CONSTRAINT items_for_distribution_pkey PRIMARY KEY (id);


--
-- Name: items items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_pkey PRIMARY KEY (id);


--
-- Name: locations locations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_pkey PRIMARY KEY (id);


--
-- Name: maintenance_history maintenance_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_history
    ADD CONSTRAINT maintenance_history_pkey PRIMARY KEY (id);


--
-- Name: maintenance_requests maintenance_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_requests
    ADD CONSTRAINT maintenance_requests_pkey PRIMARY KEY (id);


--
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (id);


--
-- Name: pending_registration pending_registration_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pending_registration
    ADD CONSTRAINT pending_registration_email_key UNIQUE (email);


--
-- Name: pending_registration pending_registration_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pending_registration
    ADD CONSTRAINT pending_registration_pkey PRIMARY KEY (id);


--
-- Name: pr_sequences pr_sequences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pr_sequences
    ADD CONSTRAINT pr_sequences_pkey PRIMARY KEY (date_key);


--
-- Name: procurement_attachments procurement_attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procurement_attachments
    ADD CONSTRAINT procurement_attachments_pkey PRIMARY KEY (id);


--
-- Name: procurement_finalizations procurement_finalizations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procurement_finalizations
    ADD CONSTRAINT procurement_finalizations_pkey PRIMARY KEY (id);


--
-- Name: purchase_order_items purchase_order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order_items
    ADD CONSTRAINT purchase_order_items_pkey PRIMARY KEY (id);


--
-- Name: purchase_orders purchase_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_pkey PRIMARY KEY (id);


--
-- Name: purchase_requests purchase_requests_control_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_requests
    ADD CONSTRAINT purchase_requests_control_number_key UNIQUE (control_number);


--
-- Name: purchase_requests purchase_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_requests
    ADD CONSTRAINT purchase_requests_pkey PRIMARY KEY (id);


--
-- Name: relocation_log relocation_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relocation_log
    ADD CONSTRAINT relocation_log_pkey PRIMARY KEY (id);


--
-- Name: requested_items requested_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requested_items
    ADD CONSTRAINT requested_items_pkey PRIMARY KEY (id);


--
-- Name: schedule_occurrences schedule_occurrences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedule_occurrences
    ADD CONSTRAINT schedule_occurrences_pkey PRIMARY KEY (id);


--
-- Name: schedule_technicians schedule_technicians_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedule_technicians
    ADD CONSTRAINT schedule_technicians_pkey PRIMARY KEY (id);


--
-- Name: schedule_templates schedule_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedule_templates
    ADD CONSTRAINT schedule_templates_pkey PRIMARY KEY (id);


--
-- Name: schedule_units schedule_units_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedule_units
    ADD CONSTRAINT schedule_units_pkey PRIMARY KEY (id);


--
-- Name: sub_locations sub_locations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sub_locations
    ADD CONSTRAINT sub_locations_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: vendor_offers vendor_offers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor_offers
    ADD CONSTRAINT vendor_offers_pkey PRIMARY KEY (id);


--
-- Name: vendors vendors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendors
    ADD CONSTRAINT vendors_pkey PRIMARY KEY (id);


--
-- Name: idx_password_reset_token_hash; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_password_reset_token_hash ON public.password_reset_tokens USING btree (token_hash);


--
-- Name: borrow_logs borrow_logs_item_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.borrow_logs
    ADD CONSTRAINT borrow_logs_item_unit_id_fkey FOREIGN KEY (item_unit_id) REFERENCES public.item_units(id);


--
-- Name: borrow_logs borrow_logs_lend_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.borrow_logs
    ADD CONSTRAINT borrow_logs_lend_by_fkey FOREIGN KEY (lend_by) REFERENCES public.users(id);


--
-- Name: password_reset_tokens password_reset_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: purchase_order_items purchase_order_items_purchase_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order_items
    ADD CONSTRAINT purchase_order_items_purchase_order_id_fkey FOREIGN KEY (purchase_order_id) REFERENCES public.purchase_orders(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict pMW4miHVzk69qUUG4eHkHWcu4zyCOAWGXRF957yrjrWhSxPHgfPr116QlH4E2yw

