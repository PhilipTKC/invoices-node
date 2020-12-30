# Invoice Generator Node

Run

  npx ts-node index.ts

# Postman Example

`http://localhost:3000/create`

## v2 Template

```
{
    "customer": {
        "email": "customer@domain.com",
        "name": "The Customer"
    },
    "dateFormat": "d MMMM YYYY",
    "invoice": {
        "items": [
            {
                "description": "Item 1",
                "rate": 50
            },
            {
                "description": "Item 2",
                "rate": 5
            }
        ],
        "subTotal": 0,
        "title": "Your Company"
    },
    "owner": {
        "accountNumber": "00-0000-0000000-00",
        "email": "owner@domain.com",
        "name": "The Owner",
        "phoneNumber": "000 0000",
        "taxNumber": "00-00-0000"
    },
    "template": "v2"
}
```

# TODO

- Update v2 Template to include Item Quantity.