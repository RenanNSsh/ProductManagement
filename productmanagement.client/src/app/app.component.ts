import { Component } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-root',
  template: `
    <nav class="navbar">
      <div class="container">
        <h1>Product Management</h1>
        <ul>
          <li><a routerLink="/orders" routerLinkActive="active">Orders</a></li>
          <li><a routerLink="/orders/new" routerLinkActive="active">New Order</a></li>
        </ul>
      </div>
    </nav>

    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .navbar {
      background-color: #333;
      color: white;
      padding: 1rem 0;
      margin-bottom: 2rem;
    }

    .navbar .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .navbar h1 {
      margin: 0;
      font-size: 1.5rem;
    }

    .navbar ul {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      gap: 1rem;
    }

    .navbar a {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
    }

    .navbar a:hover {
      background-color: #444;
    }

    .navbar a.active {
      background-color: #555;
    }

    .main-content {
      padding: 0 1rem;
    }
  `]
})
export class AppComponent {
  title = 'Product Management';
}
