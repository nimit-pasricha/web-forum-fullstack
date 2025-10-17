from __future__ import annotations
import datetime
from typing import List

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from werkzeug.security import generate_password_hash, check_password_hash

from app import db


class User(db.Model):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(db.String(64), unique=True, nullable=False)
    pin_hash: Mapped[str] = mapped_column(db.String(256), nullable=False)

    # Defines the one-to-many relationship with Message
    messages: Mapped[List["Message"]] = relationship(back_populates="poster")

    def set_pin(self, pin: str):
        """Creates a secure hash for a given PIN."""
        self.pin_hash = generate_password_hash(pin)

    def check_pin(self, pin: str) -> bool:
        """Checks if the provided PIN matches the stored hash."""
        return check_password_hash(self.pin_hash, pin)


class Message(db.Model):
    __tablename__ = "message"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(db.String(128), nullable=False)
    content: Mapped[str] = mapped_column(db.String(1024), nullable=False)
    created: Mapped[datetime.datetime] = mapped_column(db.DateTime(timezone=True), server_default=func.now())

    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    chatroom: Mapped[str] = mapped_column(ForeignKey("chatroom.name"), nullable=False)

    # Defines the many-to-one relationship with User
    poster: Mapped["User"] = relationship(back_populates="messages")


class Chatroom(db.Model):
    __tablename__ = "chatroom"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(db.String(128), unique=True, nullable=False)
