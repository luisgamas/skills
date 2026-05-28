# Core Logic — Odoo 18 Module Creator

## Tone

Imperative. Direct. No fluff. Generate complete, installable, production-ready Odoo module code.

---

## Workflow (Strict Order)

When the user requests a new module or feature:

### 1. Planning

- Identify module purpose and name (snake_case directory).
- Determine all `depends` (existing Odoo modules required).
- List models needed: new (`_name`) vs. inherited (`_inherit`).
- Identify required views, security, data, controllers, wizards, reports.

### 2. Creation Order

Generate files in this order:

**Step 1 — Module Shell:**
1. `__init__.py` (root + per-directory)
2. `__manifest__.py`

**Step 2 — Models:**
1. `models/__init__.py` (imports all model files)
2. `models/model_name.py` (one file per model)

**Step 3 — Security:**
1. `security/ir.model.access.csv`
2. `security/security.xml` (only if record rules or groups are needed)

**Step 4 — Views:**
1. `views/model_name_view.xml` (one file per model)
2. `views/menu.xml` (if top-level menus are needed)

**Step 5 — Data (if needed):**
1. `data/data.xml` or `data/model_name_data.xml`

**Step 6 — Controllers (if needed):**
1. `controllers/__init__.py`
2. `controllers/main.py`

**Step 7 — Wizards (if needed):**
1. `wizard/__init__.py`
2. `wizard/wizard_name.py`
3. `wizard/wizard_name_view.xml`

**Step 8 — Reports (if needed):**
1. `report/model_name_report.xml`
   See [`references/examples/reports-qweb.md`](../examples/reports-qweb.md) for QWeb patterns.

---

## Module Structure

```
module_name/
├── __init__.py
├── __manifest__.py
│
├── models/
│   ├── __init__.py
│   └── model_name.py
│
├── views/
│   ├── model_name_view.xml
│   └── menu.xml
│
├── security/
│   ├── ir.model.access.csv
│   └── security.xml           (optional)
│
├── data/
│   └── data.xml               (optional)
│
├── demo/
│   └── demo.xml               (optional)
│
├── controllers/
│   ├── __init__.py            (optional)
│   └── main.py                (optional)
│
├── wizard/
│   ├── __init__.py            (optional)
│   ├── wizard_name.py         (optional)
│   └── wizard_name_view.xml   (optional)
│
├── report/
│   └── report_name.xml        (optional)
│
├── static/
│   └── src/
│       ├── js/
│       ├── css/
│       └── xml/               (OWL templates)
│
└── i18n/
    └── es.po                  (optional)
```

---

## __manifest__.py Pattern

```python
{
    "name": "Module Human Name",
    "version": "18.0.1.0.0",
    "summary": "One-line description of the module.",
    "description": """
        Extended description of what this module does.
    """,
    "author": "Author Name",
    "website": "https://yourcompany.com",
    "category": "Category/Subcategory",
    "license": "LGPL-3",
    "depends": [
        "base",
        # add other module dependencies here
    ],
    "data": [
        "security/ir.model.access.csv",
        # security/security.xml must come before views
        "views/model_name_view.xml",
        "views/menu.xml",
    ],
    "demo": [
        "demo/demo.xml",
    ],
    "installable": True,
    "application": False,   # True only for top-level standalone applications
    "auto_install": False,
}
```

Version format: `{odoo_version}.{major}.{minor}.{patch}.{hotfix}` → `18.0.1.0.0`

---

## ORM — Model Patterns

### New Model

```python
from odoo import models, fields, api
from odoo.exceptions import ValidationError


class EstateProperty(models.Model):
    _name = "estate.property"
    _description = "Real Estate Property"
    _order = "name"

    # --- Basic Fields ---
    name = fields.Char(string="Name", required=True)
    description = fields.Text(string="Description")
    date_availability = fields.Date(
        string="Available From",
        default=fields.Date.add(fields.Date.today(), months=3),
        copy=False,
    )
    expected_price = fields.Float(string="Expected Price", required=True)
    selling_price = fields.Float(string="Selling Price", readonly=True, copy=False)
    living_area = fields.Integer(string="Living Area (sqm)")
    garden = fields.Boolean(string="Garden")
    garden_area = fields.Integer(string="Garden Area (sqm)")
    state = fields.Selection(
        [
            ("new", "New"),
            ("offer_received", "Offer Received"),
            ("offer_accepted", "Offer Accepted"),
            ("sold", "Sold"),
            ("cancelled", "Cancelled"),
        ],
        string="Status",
        required=True,
        default="new",
        copy=False,
    )

    # --- Relational Fields ---
    partner_id = fields.Many2one("res.partner", string="Buyer", copy=False)
    property_type_id = fields.Many2one("estate.property.type", string="Property Type")
    offer_ids = fields.One2many("estate.property.offer", "property_id", string="Offers")
    tag_ids = fields.Many2many("estate.property.tag", string="Tags")

    # --- Computed Fields ---
    total_area = fields.Integer(
        string="Total Area (sqm)", compute="_compute_total_area"
    )
    best_price = fields.Float(
        string="Best Offer", compute="_compute_best_price"
    )

    # --- Constraints ---
    _sql_constraints = [
        (
            "check_expected_price",
            "CHECK(expected_price > 0)",
            "Expected price must be strictly positive.",
        ),
        (
            "check_selling_price",
            "CHECK(selling_price >= 0)",
            "Selling price must be positive.",
        ),
    ]

    # --- Computed Methods ---
    @api.depends("living_area", "garden_area")
    def _compute_total_area(self):
        for record in self:
            record.total_area = record.living_area + record.garden_area

    @api.depends("offer_ids.price")
    def _compute_best_price(self):
        for record in self:
            record.best_price = max(record.offer_ids.mapped("price"), default=0.0)

    # --- Onchange ---
    @api.onchange("garden")
    def _onchange_garden(self):
        self.garden_area = 10 if self.garden else 0

    # --- Validation ---
    @api.constrains("selling_price", "expected_price")
    def _check_selling_price(self):
        for record in self:
            if (
                record.selling_price > 0
                and record.selling_price < record.expected_price * 0.9
            ):
                raise ValidationError(
                    "The selling price cannot be lower than 90% of the expected price."
                )

    # --- Business Logic ---
    def action_sold(self):
        for record in self:
            if record.state == "cancelled":
                raise ValidationError("Cancelled properties cannot be sold.")
            record.state = "sold"

    def action_cancel(self):
        for record in self:
            if record.state == "sold":
                raise ValidationError("Sold properties cannot be cancelled.")
            record.state = "cancelled"
```

### Inherited Model (Extension)

```python
from odoo import models, fields


class ResPartner(models.Model):
    _inherit = "res.partner"

    # Add fields to existing model — no _name needed
    property_ids = fields.One2many(
        "estate.property", "partner_id", string="Properties"
    )
```

---

## Security — ir.model.access.csv

```csv
id,name,model_id:id,group_id:id,perm_read,perm_write,perm_create,perm_unlink
access_estate_property_user,estate.property user,model_estate_property,base.group_user,1,1,1,0
access_estate_property_manager,estate.property manager,model_estate_property,base.group_system,1,1,1,1
```

Column rules:
- `id`: unique xmlid (no dots, use underscores)
- `model_id:id`: `model_` + model `_name` with dots replaced by underscores
- `group_id:id`: reference to a `res.groups` record (e.g., `base.group_user`)
- `perm_*`: 1 = allowed, 0 = denied

---

## Views — XML Patterns

### Form View

```xml
<record id="view_estate_property_form" model="ir.ui.view">
    <field name="name">estate.property.form</field>
    <field name="model">estate.property</field>
    <field name="arch" type="xml">
        <form string="Property">
            <header>
                <button name="action_sold" type="object" string="Sold"
                        states="new,offer_received,offer_accepted" class="btn-primary"/>
                <button name="action_cancel" type="object" string="Cancel"
                        states="new,offer_received,offer_accepted"/>
                <field name="state" widget="statusbar"
                       statusbar_visible="new,offer_received,offer_accepted,sold"/>
            </header>
            <sheet>
                <group>
                    <group>
                        <field name="name"/>
                        <field name="property_type_id"/>
                        <field name="tag_ids" widget="many2many_tags"/>
                        <field name="date_availability"/>
                    </group>
                    <group>
                        <field name="expected_price"/>
                        <field name="best_price"/>
                        <field name="selling_price"/>
                    </group>
                </group>
                <notebook>
                    <page string="Description">
                        <group>
                            <field name="description"/>
                            <field name="living_area"/>
                            <field name="garden"/>
                            <field name="garden_area" attrs="{'invisible': [('garden', '=', False)]}"/>
                            <field name="total_area"/>
                        </group>
                    </page>
                    <page string="Offers">
                        <field name="offer_ids"/>
                    </page>
                    <page string="Other Info">
                        <group>
                            <field name="partner_id"/>
                        </group>
                    </page>
                </notebook>
            </sheet>
        </form>
    </field>
</record>
```

### List View

```xml
<record id="view_estate_property_list" model="ir.ui.view">
    <field name="name">estate.property.list</field>
    <field name="model">estate.property</field>
    <field name="arch" type="xml">
        <list string="Properties" decoration-success="state == 'offer_accepted'"
              decoration-bf="state == 'offer_accepted'"
              decoration-muted="state == 'sold'">
            <field name="name"/>
            <field name="property_type_id"/>
            <field name="tag_ids" widget="many2many_tags"/>
            <field name="living_area"/>
            <field name="expected_price"/>
            <field name="selling_price"/>
            <field name="date_availability" optional="hide"/>
            <field name="state" optional="hide"/>
        </list>
    </field>
</record>
```

### Search View

```xml
<record id="view_estate_property_search" model="ir.ui.view">
    <field name="name">estate.property.search</field>
    <field name="model">estate.property</field>
    <field name="arch" type="xml">
        <search string="Property">
            <field name="name"/>
            <field name="property_type_id"/>
            <filter string="Available" name="available"
                    domain="[('state', 'in', ['new', 'offer_received'])]"/>
            <group expand="0" string="Group By">
                <filter string="Property Type" name="group_property_type"
                        context="{'group_by': 'property_type_id'}"/>
            </group>
        </search>
    </field>
</record>
```

### Action + Menu

```xml
<!-- Action -->
<record id="action_estate_property" model="ir.actions.act_window">
    <field name="name">Properties</field>
    <field name="res_model">estate.property</field>
    <field name="view_mode">list,form</field>
    <field name="context">{'search_default_available': 1}</field>
</record>

<!-- Top-level menu -->
<menuitem id="menu_estate_root" name="Real Estate" sequence="10"/>

<!-- Sub-menu -->
<menuitem id="menu_estate_property" name="Properties"
          parent="menu_estate_root"
          action="action_estate_property"
          sequence="10"/>
```

---

## Wizards — TransientModel Pattern

```python
from odoo import models, fields, api


class EstatePropertyOffer(models.TransientModel):
    _name = "estate.property.offer.wizard"
    _description = "Property Offer Wizard"

    property_id = fields.Many2one("estate.property", string="Property", required=True)
    price = fields.Float(string="Offer Price", required=True)
    partner_id = fields.Many2one("res.partner", string="Partner", required=True)

    def action_confirm(self):
        self.ensure_one()
        # Create the actual offer record
        self.env["estate.property.offer"].create({
            "property_id": self.property_id.id,
            "price": self.price,
            "partner_id": self.partner_id.id,
        })
        return {"type": "ir.actions.act_window_close"}
```

---

## Controllers — HTTP Routes

```python
from odoo import http
from odoo.http import request


class EstateController(http.Controller):

    @http.route("/estate/properties", auth="public", type="http", website=True)
    def list_properties(self, **kwargs):
        properties = request.env["estate.property"].sudo().search([
            ("state", "in", ["new", "offer_received"])
        ])
        return request.render("estate_management.template_property_list", {
            "properties": properties,
        })

    @http.route("/estate/property/<int:property_id>", auth="public", type="http", website=True)
    def property_detail(self, property_id, **kwargs):
        property_rec = request.env["estate.property"].sudo().browse(property_id)
        if not property_rec.exists():
            return request.not_found()
        return request.render("estate_management.template_property_detail", {
            "property": property_rec,
        })
```

---

## Computed Fields Patterns

### Stored Computed (triggers recompute on DB change)
```python
total = fields.Float(compute="_compute_total", store=True)

@api.depends("line_ids.price", "line_ids.quantity")
def _compute_total(self):
    for record in self:
        record.total = sum(line.price * line.quantity for line in record.line_ids)
```

### Non-stored Computed (recomputed every read)
```python
display_name_custom = fields.Char(compute="_compute_display_name_custom")

@api.depends("name", "postcode")
def _compute_display_name_custom(self):
    for record in self:
        record.display_name_custom = f"{record.name} ({record.postcode})"
```

### Inverse (makes computed field editable)
```python
field = fields.Float(compute="_compute_field", inverse="_inverse_field", store=True)

def _inverse_field(self):
    for record in self:
        # write back derived values
        pass
```

---

## Data Files — XML Pattern

```xml
<!-- data/estate_property_data.xml -->
<odoo>
    <data noupdate="1">
        <!-- noupdate="1": data is only loaded on install, not on upgrade -->

        <record id="estate_property_type_residential" model="estate.property.type">
            <field name="name">Residential</field>
        </record>

        <record id="estate_property_type_commercial" model="estate.property.type">
            <field name="name">Commercial</field>
        </record>

    </data>
</odoo>
```
