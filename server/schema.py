from graphene import ObjectType, Schema

from music.schema import MusicQuery


class Query(MusicQuery, ObjectType):
    pass


schema = Schema(query=Query)
