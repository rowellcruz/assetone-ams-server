--
-- PostgreSQL database dump
--

\restrict QnRslyplDGp2SAIaATL9POgK57H7BwMFjwnxmqFpY8gm21WJSDQJJLHaE3IYJUi

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
    code character varying(100) NOT NULL,
    sub_location_id integer
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
    status character varying
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
    category character varying(255),
    condition_assessment_frequency character varying DEFAULT 'weekly'::character varying
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
    role character varying(50) NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    department_id integer,
    CONSTRAINT pending_registration_role_check CHECK (((role)::text = ANY ((ARRAY['asset_administrator'::character varying, 'property_custodian'::character varying, 'technician'::character varying])::text[]))),
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
    requested_from bigint,
    for_department integer
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
-- Name: relocation_technicians; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.relocation_technicians (
    id integer NOT NULL,
    relocation_log_id integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.relocation_technicians OWNER TO postgres;

--
-- Name: relocation_technicians_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.relocation_technicians_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.relocation_technicians_id_seq OWNER TO postgres;

--
-- Name: relocation_technicians_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.relocation_technicians_id_seq OWNED BY public.relocation_technicians.id;


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
-- Name: relocation_technicians id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relocation_technicians ALTER COLUMN id SET DEFAULT nextval('public.relocation_technicians_id_seq'::regclass);


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
25	352	Rowell	77	2025-11-14 15:59:07.124427+08	\N	borrowed	\N	Temporary usage	2025-11-15 00:00:00+08
\.


--
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.departments (id, name, created_by, updated_by, deleted_by, created_at, updated_at, deleted_at, code, sub_location_id) FROM stdin;
16	IT Department	74	74	74	2025-11-12 11:01:04.317407+08	2025-11-12 11:01:16.757+08	2025-11-12 11:01:16.757+08	ITSS	31
18	General Services Office	74	74	\N	2025-11-13 20:41:10.231358+08	2025-11-13 20:41:10.231358+08	\N	GSO	\N
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
303	308	5.00	\N	\N	2025-11-10 23:19:57.051928+08	2025-11-10 23:19:57.051928+08
\.


--
-- Data for Name: item_depreciation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.item_depreciation (id, item_unit_id, method, purchase_date, rate, useful_life, accumulated_depreciation, updated_by, updated_at) FROM stdin;
295	297	straight_line	2024-10-09	0.20	5	0.00	\N	2025-11-05 04:58:52.219857+08
296	298	\N	\N	\N	5	0.00	\N	2025-11-05 05:14:26.392321+08
297	299	\N	\N	\N	5	0.00	\N	2025-11-05 05:14:26.404364+08
298	300	\N	\N	\N	5	0.00	\N	2025-11-05 05:14:26.409812+08
299	301	\N	\N	\N	5	0.00	\N	2025-11-05 05:14:26.414988+08
300	302	\N	\N	\N	5	0.00	\N	2025-11-05 05:14:26.421467+08
301	303	straight_line	2025-10-30	0.20	5	0.00	\N	2025-11-06 20:00:05.817764+08
302	304	straight_line	2025-10-30	0.20	5	0.00	\N	2025-11-06 20:00:05.870313+08
303	305	straight_line	2025-10-30	0.20	5	0.00	\N	2025-11-06 20:00:05.896925+08
304	306	straight_line	2025-10-30	0.20	5	0.00	\N	2025-11-06 20:00:05.931412+08
305	307	straight_line	2025-10-30	0.20	5	0.00	\N	2025-11-06 20:00:05.953508+08
306	308	\N	2020-10-27	\N	\N	0.00	\N	2025-11-10 23:19:56.957418+08
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

COPY public.item_units (id, item_id, serial_number, unit_tag, specifications, sub_location_id, is_legacy, owner_department_id, created_by, updated_by, deleted_by, created_at, updated_at, deleted_at, vendor_id, brand, condition, purchase_date, purchase_cost, status) FROM stdin;
347	39	\N	ITSS-IT-0001	\N	31	t	\N	75	75	\N	2025-11-14 12:15:43.885213+08	2025-11-14 12:15:43.885213+08	\N	32	HP	100	2025-11-08 00:00:00+08	\N	under_maintenance
348	39	\N	ITSS-IT-0002	\N	31	t	\N	75	75	\N	2025-11-14 12:15:43.996659+08	2025-11-14 12:15:43.996659+08	\N	32	HP	100	2025-11-08 00:00:00+08	\N	under_maintenance
349	39	\N	ITSS-IT-0003	\N	31	t	\N	75	75	\N	2025-11-14 12:15:44.005122+08	2025-11-14 12:15:44.005122+08	\N	32	HP	100	2025-11-08 00:00:00+08	\N	under_maintenance
350	39	\N	ITSS-IT-0004	\N	31	t	\N	75	75	\N	2025-11-14 12:15:44.014116+08	2025-11-14 12:15:44.014116+08	\N	32	HP	100	2025-11-08 00:00:00+08	\N	under_maintenance
351	39	\N	ITSS-IT-0005	\N	31	t	\N	75	75	\N	2025-11-14 12:15:44.022562+08	2025-11-14 12:15:44.022562+08	\N	32	HP	100	2025-11-08 00:00:00+08	\N	under_maintenance
353	39	\N	ITSS-IT-0007	\N	\N	t	16	76	76	\N	2025-11-14 12:37:03.953427+08	2025-11-14 12:37:03.953427+08	\N	31	asd	100	2025-11-14 00:00:00+08	\N	in_use
352	39	\N	ITSS-IT-0006	\N	\N	t	16	76	76	\N	2025-11-14 12:36:31.954105+08	2025-11-14 12:36:31.954105+08	\N	23	gege	100	2025-11-14 00:00:00+08	\N	borrowed
341	40	\N	GSO-IT-0005	\N	31	t	\N	74	74	\N	2025-11-13 20:24:43.183576+08	2025-11-13 20:24:43.183576+08	\N	\N	gege	100	2025-11-13 00:00:00+08	\N	available
342	40	\N	GSO-IT-0006	\N	31	t	\N	74	74	\N	2025-11-13 20:24:43.196985+08	2025-11-13 20:24:43.196985+08	\N	\N	gege	100	2025-11-13 00:00:00+08	\N	available
343	40	\N	GSO-IT-0007	\N	31	t	\N	74	74	\N	2025-11-13 20:24:43.209905+08	2025-11-13 20:24:43.209905+08	\N	\N	gege	100	2025-11-13 00:00:00+08	\N	available
344	40	\N	GSO-IT-0008	\N	31	t	\N	74	74	\N	2025-11-13 20:24:43.221453+08	2025-11-13 20:24:43.221453+08	\N	\N	gege	100	2025-11-13 00:00:00+08	\N	available
345	40	\N	GSO-IT-0009	\N	31	t	\N	74	74	\N	2025-11-13 20:24:43.236986+08	2025-11-13 20:24:43.236986+08	\N	\N	gege	100	2025-11-13 00:00:00+08	\N	available
346	40	\N	GSO-IT-0010	\N	31	t	\N	74	74	\N	2025-11-13 20:24:43.249794+08	2025-11-13 20:24:43.249794+08	\N	\N	gege	100	2025-11-13 00:00:00+08	\N	available
337	40	\N	GSO-IT-0001	\N	31	t	\N	74	74	\N	2025-11-13 20:24:43.121081+08	2025-11-13 20:24:43.121081+08	\N	\N	gege	100	2025-11-13 00:00:00+08	\N	in_use
338	40	\N	GSO-IT-0002	\N	31	t	\N	74	74	\N	2025-11-13 20:24:43.137984+08	2025-11-13 20:24:43.137984+08	\N	\N	gege	100	2025-11-13 00:00:00+08	\N	in_use
339	40	\N	GSO-IT-0003	\N	31	t	\N	74	74	\N	2025-11-13 20:24:43.153478+08	2025-11-13 20:24:43.153478+08	\N	\N	gege	100	2025-11-13 00:00:00+08	\N	in_use
340	40	\N	GSO-IT-0004	\N	31	t	\N	74	74	\N	2025-11-13 20:24:43.166399+08	2025-11-13 20:24:43.166399+08	\N	\N	gege	100	2025-11-13 00:00:00+08	\N	in_use
\.


--
-- Data for Name: items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.items (id, name, department_id, created_by, updated_by, deleted_by, created_at, updated_at, deleted_at, useful_life, rul_percentage, performance_percentage, physical_percentage, rul_multiplier, performance_multiplier, physical_multiplier, category, condition_assessment_frequency) FROM stdin;
32	Aircon	\N	74	74	\N	2025-11-13 15:46:41.731334+08	2025-11-13 15:46:41.731334+08	\N	\N	33	33	34	1.0	1.0	1.0	Appliances / Electronics	weekly
33	Desktop PC	\N	74	74	\N	2025-11-13 15:48:39.914004+08	2025-11-13 15:48:39.914004+08	\N	\N	33	33	34	1.0	1.0	1.0	IT Equipment / Peripherals	weekly
34	Keyboard	\N	74	74	\N	2025-11-13 15:49:15.395359+08	2025-11-13 15:49:15.395359+08	\N	\N	33	33	34	1.0	1.0	1.0	IT Equipment / Peripherals	weekly
35	Projector	\N	74	74	\N	2025-11-13 15:51:53.751937+08	2025-11-13 15:51:53.751937+08	\N	\N	33	33	34	1.0	1.0	1.0	Appliances / Electronics	weekly
36	Television	\N	74	74	\N	2025-11-13 15:53:20.505552+08	2025-11-13 15:53:20.505552+08	\N	\N	33	33	34	1.0	1.0	1.0	IT Equipment / Peripherals	weekly
37	Monitor	\N	74	74	\N	2025-11-13 15:54:46.190018+08	2025-11-13 15:54:46.190018+08	\N	\N	33	33	34	1.0	1.0	1.0	IT Equipment / Peripherals	weekly
38	Printer	\N	74	74	\N	2025-11-13 15:56:06.251382+08	2025-11-13 15:56:06.251382+08	\N	\N	33	33	34	1.0	1.0	1.0	IT Equipment / Peripherals	weekly
40	Tablet	16	74	75	\N	2025-11-13 15:58:11.13743+08	2025-11-14 12:04:40.972+08	\N	5	33	34	33	1.0	1.0	1.0	IT Equipment / Peripherals	weekly
31	Laptop	\N	74	74	\N	2025-11-13 15:38:56.837661+08	2025-11-13 15:45:22.106+08	\N	\N	20	20	60	0.6	0.6	1.8	IT Equipment / Peripherals	weekly
39	Mouse	16	74	76	\N	2025-11-13 15:57:24.878054+08	2025-11-14 14:21:52.872+08	\N	5	33	34	33	1.0	1.0	1.0	IT Equipment / Peripherals	weekly
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
8	Aula Magna	74	74	\N	2025-11-12 10:46:54.87916+08	2025-11-12 10:46:54.87916+08	\N
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
2	350	4	4	pending	hehe	rowellcruz145@gmail.com	2025-11-14 15:20:11.055141+08	\N	\N
\.


--
-- Data for Name: password_reset_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.password_reset_tokens (id, user_id, token_hash, expires_at, used, created_at) FROM stdin;
11	76	f00f8e902850993182948c041be2d7d5cbaccd6621f0819662a50631d3660f57	2025-11-14 20:31:12.786	f	2025-11-14 20:21:12.794839
\.


--
-- Data for Name: pending_registration; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pending_registration (id, first_name, last_name, email, role, status, created_at, updated_at, department_id) FROM stdin;
18	Rowell	Cruz	cruzrowellt11@gmail.com	asset_administrator	approved	2025-11-14 12:24:29.789938	2025-11-14 12:24:37.686196	\N
19	Rowell	Cruz	rowellcruz145@gmail.com	property_custodian	approved	2025-11-14 13:05:43.031522	2025-11-14 13:09:10.19056	\N
20	Rowell	Cruz	cruz.rowell00510@dyci.edu.ph	technician	approved	2025-11-14 13:10:32.676838	2025-11-14 13:11:05.408414	\N
21	Rowell	Cruz	first.acc145@gmail.com	technician	approved	2025-11-14 13:11:55.256359	2025-11-14 13:12:05.326133	\N
22	Rowell	Cruz	cruz.rowell00510@gmail.com	technician	approved	2025-11-14 13:14:45.894266	2025-11-14 13:15:03.206416	\N
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

COPY public.relocation_log (id, item_unit_id, from_sub_location_id, to_sub_location_id, requested_by, completed_by, status, requested_at, completed_at, requested_from, for_department) FROM stdin;
15	319	21	22	69	\N	completed	2025-11-11 12:16:23.86273	2025-11-11 16:05:42.871	\N	15
\.


--
-- Data for Name: relocation_technicians; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.relocation_technicians (id, relocation_log_id, user_id) FROM stdin;
4	15	68
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
25	22	2025-11-15 00:18:00+08	in_progress	\N	\N	\N	\N	77	\N	\N	\N	2025-11-14 12:18:44.052338+08	2025-11-14 12:18:44.052338+08	2025-11-14 14:25:15.483+08	\N	\N	\N
\.


--
-- Data for Name: schedule_technicians; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.schedule_technicians (id, occurrence_id, user_id, assigned_at) FROM stdin;
4	25	80	2025-11-14 14:25:15.489209+08
5	25	79	2025-11-14 14:25:15.489209+08
6	25	78	2025-11-14 14:25:15.489209+08
\.


--
-- Data for Name: schedule_templates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.schedule_templates (id, type, title, description, frequency_value, frequency_unit, grace_period_value, grace_period_unit, status, start_date, end_date, created_by, updated_by, stopped_by, created_at, updated_at, stopped_at, item_id) FROM stdin;
22	PM	\N	Cleaning ventilation	1	weeks	\N	\N	active	2025-11-15 00:18:00+08	\N	74	74	\N	2025-11-14 12:18:43.958913+08	2025-11-14 12:18:43.796+08	\N	39
\.


--
-- Data for Name: schedule_units; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.schedule_units (id, occurrence_id, item_unit_id, status) FROM stdin;
8	25	352	pending
9	25	337	pending
10	25	346	pending
11	25	347	pending
12	25	348	pending
13	25	349	pending
14	25	350	pending
15	25	351	pending
16	25	343	pending
17	25	342	pending
18	25	339	pending
19	25	344	pending
20	25	341	pending
21	25	340	pending
22	25	338	pending
23	25	345	pending
\.


--
-- Data for Name: sub_locations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sub_locations (id, location_id, name, created_by, updated_by, deleted_by, created_at, updated_at, deleted_at) FROM stdin;
31	8	Room 101	74	74	\N	2025-11-12 10:46:54.87916+08	2025-11-12 10:46:54.87916+08	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, first_name, last_name, email, password, role, department_id, status, created_by, updated_by, disabled_by, deleted_by, created_at, updated_at, disabled_at, deleted_at) FROM stdin;
80	Rowell	Cruz	cruz.rowell00510@gmail.com	$2b$10$NVMfIIH.lsKC291PLwYbs.xFI/aYvdrgmVLH/4ylWbqW42WL4Lawy	technician	16	inactive	\N	\N	\N	\N	2025-11-14 13:15:03.162648+08	2025-11-14 13:15:03.162648+08	\N	\N
76	Rowell	Cruz	cruzrowellt11@gmail.com	$2b$10$JNYgbJEHLRYbBCqgaWjjpOyQUIl6JUF46AzVZumL5o0LDLlsPjPBm	asset_administrator	\N	inactive	\N	\N	\N	\N	2025-11-14 12:24:37.68389+08	2025-11-14 12:24:37.68389+08	\N	\N
1	System	Admin	samms.dyci@gmail.com	$2b$10$DP20MeyrxyUje4ChAENW4O8uBsONc97al9Q7e403I7ADbX2w7ZDye	system_administrator	\N	inactive	\N	1	1	\N	2025-10-16 18:13:18.932041+08	2025-10-16 11:03:52.015+08	2025-10-16 11:03:52.015+08	\N
77	Rowell	Cruz	rowellcruz145@gmail.com	$2b$10$IWe4LMuIzxd.hLQNVme6vuEhEV/hs/iAjC9ruojlWlxDxxCcZnIq6	property_custodian	16	inactive	\N	\N	\N	\N	2025-11-14 13:09:10.132355+08	2025-11-14 13:09:10.132355+08	\N	\N
78	Rowell	Cruz	cruz.rowell00510@dyci.edu.ph	$2b$10$vO3sfahIwn1qJOGVl4XX4.8BVNgm28m6rjC/wdOxrCnoX31zDWHkG	technician	16	inactive	\N	\N	\N	\N	2025-11-14 13:11:05.405173+08	2025-11-14 13:11:05.405173+08	\N	\N
79	Rowell	Cruz	first.acc145@gmail.com	$2b$10$bkFEo0uVeiocKnqna99cHOcryBJTn4o61lS3R7b1LdyboeETLd0Dm	technician	16	inactive	\N	\N	\N	\N	2025-11-14 13:12:05.322885+08	2025-11-14 13:12:05.322885+08	\N	\N
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
23	Tech Solutions Inc.	Maria Lopez	maria.lopez@techsolutions.com	+63 912 345 6789	123 IT Park, Quezon City, Philippines	1	1	\N	2025-11-14 12:15:08.679088+08	2025-11-14 12:15:08.679088+08	\N
24	OfficePro Supplies	Juan Dela Cruz	juan.delacruz@officepro.ph	+63 923 456 7890	45 Makati Ave, Makati City, Philippines	1	1	\N	2025-11-14 12:15:08.679088+08	2025-11-14 12:15:08.679088+08	\N
25	ElectroHub	Angela Reyes	angela.reyes@electrohub.com	+63 934 567 8901	78 Electronics St, Pasig City, Philippines	1	1	\N	2025-11-14 12:15:08.679088+08	2025-11-14 12:15:08.679088+08	\N
26	FurnitureWorld	Ramon Santos	ramon.santos@furnitureworld.ph	+63 945 678 9012	12 Furniture Rd, Mandaluyong City, Philippines	1	1	\N	2025-11-14 12:15:08.679088+08	2025-11-14 12:15:08.679088+08	\N
27	Mechanical Masters	Lito Navarro	lito.navarro@mechmasters.ph	+63 956 789 0123	34 Mechanics Lane, Taguig City, Philippines	1	1	\N	2025-11-14 12:15:08.679088+08	2025-11-14 12:15:08.679088+08	\N
28	Peripherals Plus	Grace Tan	grace.tan@peripheralsplus.com	+63 967 890 1234	56 Tech Blvd, Quezon City, Philippines	1	1	\N	2025-11-14 12:15:08.679088+08	2025-11-14 12:15:08.679088+08	\N
29	Green Energy Co.	Carlos Mendoza	carlos.mendoza@greenenergy.ph	+63 978 901 2345	89 Solar Park, Pasig City, Philippines	1	1	\N	2025-11-14 12:15:08.679088+08	2025-11-14 12:15:08.679088+08	\N
30	Tools & Equipment Ph	Melissa Cruz	melissa.cruz@toolsph.com	+63 989 012 3456	23 Industrial Ave, Makati City, Philippines	1	1	\N	2025-11-14 12:15:08.679088+08	2025-11-14 12:15:08.679088+08	\N
31	Appliances Central	Ricardo Villanueva	ricardo.villanueva@appliancescentral.ph	+63 990 123 4567	67 Appliance St, Mandaluyong City, Philippines	1	1	\N	2025-11-14 12:15:08.679088+08	2025-11-14 12:15:08.679088+08	\N
32	Smart IT Solutions	Jocelyn Ramos	jocelyn.ramos@smartit.ph	+63 901 234 5678	101 Techno Park, Taguig City, Philippines	1	1	\N	2025-11-14 12:15:08.679088+08	2025-11-14 12:15:08.679088+08	\N
\.


--
-- Name: activity_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.activity_log_id_seq', 9, true);


--
-- Name: borrow_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.borrow_logs_id_seq', 25, true);


--
-- Name: departments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.departments_id_seq', 20, true);


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

SELECT pg_catalog.setval('public.item_costs_id_seq', 303, true);


--
-- Name: item_depreciation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.item_depreciation_id_seq', 306, true);


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

SELECT pg_catalog.setval('public.item_units_id_seq', 353, true);


--
-- Name: items_for_distribution_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.items_for_distribution_id_seq', 112, true);


--
-- Name: items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.items_id_seq', 40, true);


--
-- Name: locations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.locations_id_seq', 8, true);


--
-- Name: maintenance_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.maintenance_history_id_seq', 1, false);


--
-- Name: maintenance_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.maintenance_requests_id_seq', 2, true);


--
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.password_reset_tokens_id_seq', 11, true);


--
-- Name: pending_registration_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pending_registration_id_seq', 22, true);


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

SELECT pg_catalog.setval('public.relocation_log_id_seq', 15, true);


--
-- Name: relocation_technicians_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.relocation_technicians_id_seq', 4, true);


--
-- Name: requested_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.requested_items_id_seq', 20, true);


--
-- Name: schedule_occurrences_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.schedule_occurrences_id_seq', 25, true);


--
-- Name: schedule_technicians_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.schedule_technicians_id_seq', 6, true);


--
-- Name: schedule_templates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.schedule_templates_id_seq', 22, true);


--
-- Name: schedule_units_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.schedule_units_id_seq', 23, true);


--
-- Name: sub_locations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sub_locations_id_seq', 31, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 80, true);


--
-- Name: vendor_offers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vendor_offers_id_seq', 43, true);


--
-- Name: vendors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vendors_id_seq', 32, true);


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
-- Name: relocation_technicians relocation_technicians_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relocation_technicians
    ADD CONSTRAINT relocation_technicians_pkey PRIMARY KEY (id);


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

\unrestrict QnRslyplDGp2SAIaATL9POgK57H7BwMFjwnxmqFpY8gm21WJSDQJJLHaE3IYJUi

