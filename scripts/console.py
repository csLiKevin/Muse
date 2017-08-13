from __future__ import unicode_literals


class Console(object):
    """
    Helper class for printing colored lines in the terminal.
    """
    # Terminal sequences.
    RESET = "\033[0m"
    ERROR = "\033[91m"
    SUCCESS = "\033[92m"
    WARNING = "\033[93m"
    INFO = "\033[94m"

    @staticmethod
    def put(text, sequence=""):
        print "{0}{1} {2}".format(sequence, text, Console.RESET)

    @staticmethod
    def error(text):
        Console.put(text, Console.ERROR)

    @staticmethod
    def success(text):
        Console.put(text, Console.SUCCESS)

    @staticmethod
    def warning(text):
        Console.put(text, Console.WARNING)

    @staticmethod
    def info(text):
        Console.put(text, Console.INFO)
