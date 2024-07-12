CREATE TABLE IF NOT EXISTS "sys_dept" (
	"id" serial PRIMARY KEY NOT NULL,
	"parent_id" integer,
	"name" text NOT NULL,
	"phone" text,
	"principal" text,
	"email" text,
	"remark" text,
	"sort" smallint DEFAULT 0 NOT NULL,
	"type" smallint,
	"create_time" timestamp (3) DEFAULT now() NOT NULL,
	"update_time" timestamp (3) NOT NULL,
	"status" smallint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sys_dept_to_role" (
	"dept_id" integer NOT NULL,
	"role_id" integer NOT NULL,
	CONSTRAINT "sys_dept_to_role_dept_id_role_id_pk" PRIMARY KEY("dept_id","role_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sys_login_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_name" text NOT NULL,
	"ip" text,
	"address" text,
	"sys" text,
	"browser" text,
	"behavior" text,
	"status" smallint NOT NULL,
	"login_time" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sys_menu" (
	"id" serial PRIMARY KEY NOT NULL,
	"parent_id" integer,
	"title" text NOT NULL,
	"menu_type" smallint NOT NULL,
	"auths" text,
	"path" text,
	"name" text,
	"component" text,
	"icon" text,
	"extra-icon" text,
	"redirect" text,
	"enter_transition" text,
	"leave_transition" text,
	"active_path" text,
	"frame_src" text,
	"frame_loading" boolean,
	"keepAlive" boolean,
	"showLink" boolean,
	"showParent" boolean,
	"fixedTag" boolean,
	"hiddenTag" boolean,
	"rank" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "sys_menu_title_unique" UNIQUE("title")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sys_menu_to_role" (
	"menu_id" integer NOT NULL,
	"role_id" integer NOT NULL,
	CONSTRAINT "sys_menu_to_role_menu_id_role_id_pk" PRIMARY KEY("menu_id","role_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sys_role" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"remark" text,
	"sort" integer DEFAULT 0 NOT NULL,
	"status" smallint NOT NULL,
	CONSTRAINT "sys_role_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sys_user" (
	"id" serial PRIMARY KEY NOT NULL,
	"avatar" text,
	"user_name" text NOT NULL,
	"nick_name" text,
	"password" text NOT NULL,
	"phone" text,
	"email" text,
	"sex" smallint,
	"remark" text,
	"dept_id" integer,
	"status" smallint NOT NULL,
	"create_time" timestamp (3) DEFAULT now() NOT NULL,
	"update_time" timestamp (3) NOT NULL,
	CONSTRAINT "sys_user_phone_unique" UNIQUE("phone"),
	CONSTRAINT "sys_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sys_user_to_role" (
	"user_id" integer NOT NULL,
	"role_id" integer NOT NULL,
	CONSTRAINT "sys_user_to_role_user_id_role_id_pk" PRIMARY KEY("user_id","role_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sys_dept" ADD CONSTRAINT "sys_dept_parent_id_sys_dept_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."sys_dept"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sys_dept_to_role" ADD CONSTRAINT "sys_dept_to_role_dept_id_sys_dept_id_fk" FOREIGN KEY ("dept_id") REFERENCES "public"."sys_dept"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sys_dept_to_role" ADD CONSTRAINT "sys_dept_to_role_role_id_sys_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."sys_role"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sys_menu" ADD CONSTRAINT "sys_menu_parent_id_sys_menu_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."sys_menu"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sys_menu_to_role" ADD CONSTRAINT "sys_menu_to_role_menu_id_sys_menu_id_fk" FOREIGN KEY ("menu_id") REFERENCES "public"."sys_menu"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sys_menu_to_role" ADD CONSTRAINT "sys_menu_to_role_role_id_sys_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."sys_role"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sys_user" ADD CONSTRAINT "sys_user_dept_id_sys_dept_id_fk" FOREIGN KEY ("dept_id") REFERENCES "public"."sys_dept"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sys_user_to_role" ADD CONSTRAINT "sys_user_to_role_user_id_sys_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."sys_user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sys_user_to_role" ADD CONSTRAINT "sys_user_to_role_role_id_sys_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."sys_role"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
