-- 1. Trigger for Vaccinations
CREATE OR REPLACE FUNCTION decrease_inventory_vaccine() RETURNS TRIGGER AS $$
BEGIN
    -- Attempt to find an inventory item with the same name (case insensitive)
    -- and decrement it by 1.
    UPDATE inventory_items
    SET quantity = quantity - 1,
        updated_at = NOW()
    WHERE lower(name) = lower(NEW.vaccine_name)
    AND quantity > 0;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_vaccination_log
AFTER INSERT ON vaccinations
FOR EACH ROW
EXECUTE FUNCTION decrease_inventory_vaccine();


-- 2. Trigger for Paid Invoices
CREATE OR REPLACE FUNCTION decrease_inventory_invoice() RETURNS TRIGGER AS $$
BEGIN
    -- If status changed to 'paid'
    IF NEW.status = 'paid' AND (OLD.status IS DISTINCT FROM 'paid') THEN
        
        -- Update inventory for all items in this invoice
        -- matching by name (description)
        UPDATE inventory_items
        SET quantity = quantity - sub.qty,
            updated_at = NOW()
        FROM (
            SELECT description, quantity as qty 
            FROM invoice_items 
            WHERE invoice_id = NEW.id
        ) as sub
        WHERE lower(inventory_items.name) = lower(sub.description);
        
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_invoice_paid
AFTER UPDATE ON invoices
FOR EACH ROW
EXECUTE FUNCTION decrease_inventory_invoice();
