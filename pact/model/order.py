from dataclasses import dataclass
from datetime import date


@dataclass
class Order:
    """Data class representing the pact order."""

    id: str
    dispatch_on: date
    cost: float
    coffee_sku: str
    item_id: str

    @classmethod
    def from_dict(cls, d: dict[str, any]):
        """May the response json onto an Order."""
        return Order(
            id=d["id"],
            dispatch_on=date.fromisoformat(d["dispatch_on"]),
            cost=float(d["total"]),
            coffee_sku=d["items"][0]["sku"],
            item_id=d["items"][0]["id"],
        )
