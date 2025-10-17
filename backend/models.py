from __future__ import annotations

import datetime
from typing import List

from extensions import db
from sqlalchemy import ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from werkzeug.security import check_password_hash, generate_password_hash


class User(db.Model):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(db.String(64), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(db.String(256), nullable=False)
    messages: Mapped[List["Message"]] = relationship(back_populates="poster")

    def __init__(self, username, password):
        self.username = username
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        """Checks if the provided password matches the stored hash."""
        return check_password_hash(self.password_hash, password)


class Message(db.Model):
    __tablename__ = "message"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(db.String(128), nullable=False)
    content: Mapped[str] = mapped_column(db.String(1024), nullable=False)
    created: Mapped[datetime.datetime] = mapped_column(db.DateTime(timezone=True), server_default=func.now())

    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    chatroom: Mapped[str] = mapped_column(ForeignKey("chatroom.name"), nullable=False)

    poster: Mapped["User"] = relationship(back_populates="messages")


class Chatroom(db.Model):
    __tablename__ = "chatroom"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(db.String(128), unique=True, nullable=False)
