import sys
from PyQt6.QtWidgets import QApplication, QMainWindow, QVBoxLayout, QPushButton, QWidget, QStackedWidget, QLabel, QToolBar
from PyQt6.QtCore import Qt

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()

        self.setWindowTitle("Sistema de Caja")
        self.setGeometry(100, 100, 900, 600)

        # Widget central
        central_widget = QWidget(self)
        self.setCentralWidget(central_widget)

        # Layout principal
        layout = QVBoxLayout(central_widget)

        # Barra de navegación (puede ser QToolBar o QVBoxLayout con botones)
        self.toolbar = QToolBar("Menú")
        self.addToolBar(Qt.ToolBarArea.LeftToolBarArea, self.toolbar)

        # Stack de páginas
        self.stack = QStackedWidget(self)
        layout.addWidget(self.stack)

        # Crear páginas
        self.pages = {
            "Cobrar": self.create_page("Cobrar Productos"),
            "Agregar": self.create_page("Agregar Producto"),
            "Editar": self.create_page("Editar Producto"),
            "Eliminar": self.create_page("Eliminar Producto"),
            "Caja": self.create_page("Ver Caja"),
            "Cierre": self.create_page("Cierre de Caja"),
        }

        # Agregar páginas al stack
        for name, page in self.pages.items():
            self.stack.addWidget(page)

        # Agregar botones a la barra de navegación
        for name in self.pages.keys():
            btn = QPushButton(name)
            btn.clicked.connect(lambda checked, page=name: self.change_page(page))
            self.toolbar.addWidget(btn)

        # Mostrar la primera página
        self.stack.setCurrentWidget(self.pages["Cobrar"])

    def create_page(self, text):
        """Crea un QWidget con un QLabel en el centro"""
        page = QWidget()
        layout = QVBoxLayout(page)
        label = QLabel(text, alignment=Qt.AlignmentFlag.AlignCenter)
        layout.addWidget(label)
        return page

    def change_page(self, page_name):
        """Cambia la página activa en el QStackedWidget"""
        self.stack.setCurrentWidget(self.pages[page_name])

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec())
