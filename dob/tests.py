import unittest
from app import app


class DateOfBirthTests(unittest.TestCase):
    def setUp(self):
        app.testing = True
        self.app = app.test_client()

    def test_index_route(self):
        self.assertEqual(
            self.app.get('/').data.decode('utf-8'), 'Hello World!')

    def test_post_date_of_birth(self):
        r = self.app.post(
            '/add_dob',
            data=dict(username='Finn the human', date_of_birth='23/02/1993'))
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.data.decode('utf-8'), '{"status":"success"}')


if __name__ == '__main__':
    unittest.main()
