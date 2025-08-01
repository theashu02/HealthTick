"use client";
import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Client } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface ClientSearchProps {
  clients: Client[];
  searchTerm: string;
  selectedClient: Client | null;
  onSearchChange: (term: string) => void;
  onClientSelect: (client: Client | null) => void;
}

const ClientSearch: React.FC<ClientSearchProps> = ({
  clients,
  searchTerm,
  selectedClient,
  onSearchChange,
  onClientSelect,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);

    if (selectedClient) {
      onClientSelect(null);
    }
  };

  const handleClientSelect = (client: Client) => {
    onSearchChange(client.name);
    onClientSelect(client);
    setIsFocused(false);
  };

  const filteredClients = useMemo(
    () =>
      clients.filter(
        (c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.phone.includes(searchTerm)
      ),
    [clients, searchTerm]
  );

  return (
    <div className="relative">
      <label
        htmlFor="client-search"
        className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
      >
        Client
      </label>
      <div className="relative flex items-center">
        <Search
          size={20}
          className="absolute left-3 text-gray-400 pointer-events-none"
        />
        <input
          id="client-search"
          type="text"
          value={searchTerm}
          // The onChange now calls the updated handler
          onChange={handleSearchChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setTimeout(() => setIsFocused(false), 150);
          }}
          placeholder="Search by name or phone..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          autoComplete="off"
        />
      </div>

      {isFocused && !selectedClient && filteredClients.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-stone-900 dark:text-gray-300 hover:text-gray-400 border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {filteredClients.map((client) => (
            <li key={client.id}>
              <Button
                variant="ghost"
                onMouseDown={(e) => e.preventDefault()} // Prevents blur on input
                onClick={() => handleClientSelect(client)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 hover:dark:bg-gray-550 hover:text-black"
              >
                {client.name}{" "}
                <span className="text-sm text-gray-500">- {client.phone}</span>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ClientSearch;
