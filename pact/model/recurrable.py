from dataclasses import dataclass
from typing import Dict
from .order import Order


@dataclass
class Recurable:
    id: str
    name: str
    grind_size: str
    active: bool
    current_order: Order
    amount: int

    @classmethod
    def from_dict(self, d: Dict[str, any]):
        active = d["current_state"] != "paused"
        return Recurable(
            id=d["id"],
            name=d["name"],
            grind_size=d["grind_size"],
            amount=int(d["amount"]),
            active=active,
            current_order=Order.from_dict(d["current_order"]) if active else None,
        )
