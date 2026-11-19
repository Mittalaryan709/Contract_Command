import pymysql

pymysql.install_as_MySQLdb()

# Python 3.14/3.15 compatibility fix for Django Template BaseContext.__copy__
# In Python 3.15, copy(super()) returns a super proxy object without __dict__.
# We ensure BaseContext shallow-copies its instance dictionary and dict stack cleanly.
try:
    import django.template.context as _django_ctx

    def _python315_basecontext_copy(self):
        dup = self.__class__.__new__(self.__class__)
        dup.__dict__.update(self.__dict__)
        dup.dicts = self.dicts[:]
        return dup

    _django_ctx.BaseContext.__copy__ = _python315_basecontext_copy
except Exception:
    pass
