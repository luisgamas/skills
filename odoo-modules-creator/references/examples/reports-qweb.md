# Reports — QWeb PDF Pattern

## Report Action

Register a report as a server action bound to a model:

```xml
<!-- report/estate_property_report.xml -->

<record id="action_report_estate_property" model="ir.actions.report">
    <field name="name">Property Summary</field>
    <field name="model">estate.property</field>
    <field name="report_type">qweb-pdf</field>
    <field name="report_name">estate_management.report_estate_property_document</field>
    <field name="report_file">estate_management.report_estate_property_document</field>
    <field name="binding_model_id" ref="model_estate_property"/>
    <field name="binding_type">report</field>
</record>
```

Key fields:
- `report_type`: `qweb-pdf` for PDF output, `qweb-html` for HTML preview.
- `report_name`: must match the QWeb template `id` below (fully qualified with module name).
- `binding_model_id`: links the report to the model's "Print" button dropdown.
- `binding_type`: `report` for print actions.

## QWeb Template

```xml
<template id="report_estate_property_document">
    <t t-call="web.html_container">
        <t t-call="web.external_layout">
            <div class="page">
                <t t-foreach="docs" t-as="doc">
                    <h2><t t-esc="doc.name"/></h2>
                    <table class="table table-sm">
                        <tr>
                            <td><strong>Expected Price</strong></td>
                            <td><t t-esc="doc.expected_price" t-options="{'widget': 'float', 'precision': 2}"/></td>
                        </tr>
                        <tr>
                            <td><strong>Selling Price</strong></td>
                            <td><t t-esc="doc.selling_price" t-options="{'widget': 'float', 'precision': 2}"/></td>
                        </tr>
                        <tr>
                            <td><strong>Status</strong></td>
                            <td><t t-esc="doc.state"/></td>
                        </tr>
                    </table>
                    <t t-if="doc.offer_ids">
                        <h4>Offers</h4>
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>Partner</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                <t t-foreach="doc.offer_ids" t-as="offer">
                                    <tr>
                                        <td><t t-esc="offer.partner_id.name"/></td>
                                        <td><t t-esc="offer.price" t-options="{'widget': 'float', 'precision': 2}"/></td>
                                    </tr>
                                </t>
                            </tbody>
                        </table>
                    </t>
                </t>
            </div>
        </t>
    </t>
</template>
```

## QWeb Directives Reference

| Directive | Purpose | Example |
|-----------|---------|---------|
| `t-esc` | Output escaped value | `<t t-esc="doc.name"/>` |
| `t-raw` | Output raw HTML (use carefully) | `<t t-raw="doc.description"/>` |
| `t-if` | Conditional rendering | `<t t-if="doc.garden">` |
| `t-foreach` / `t-as` | Loop over records | `<t t-foreach="docs" t-as="doc">` |
| `t-set` / `t-value` | Variable assignment | `<t t-set="total" t-value="0"/>` |
| `t-att-*` | Dynamic attribute | `<div t-att-class="'text-danger' if doc.state == 'cancelled' else ''"/>` |
| `t-call` | Include another template | `<t t-call="web.external_layout">` |
| `t-options` | Formatting options | `t-options="{'widget': 'monetary'}"` |

## Manifest Declaration

Report XML files must be listed in the manifest `data` key:

```python
"data": [
    "security/ir.model.access.csv",
    "views/model_name_view.xml",
    "report/model_name_report.xml",   # after views
],
```
